/*! SolarNet-MT · inferencia de la red neuronal en JavaScript puro (navegador, Node y funciones serverless de Vercel).
 *  Replica exactamente la red entrenada con Keras: ramas técnica y social -> cascada económica -> cabeza de adopción (softmax).
 *  Ensamble profundo: promedia las probabilidades de 5 redes y usa su desviación como medida de incertidumbre. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SolarNet = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const CLASES = ["No", "Tal vez", "Sí"];

  function dense(x, L) {
    const W = L.W, b = L.b, out = b.slice();
    for (let i = 0; i < x.length; i++) {
      const xi = x[i];
      if (xi === 0) continue;
      const row = W[i];
      for (let j = 0; j < out.length; j++) out[j] += xi * row[j];
    }
    return out;
  }
  const relu = (v) => v.map((a) => (a > 0 ? a : 0));
  function softmax(z) {
    const m = Math.max.apply(null, z), e = z.map((a) => Math.exp(a - m)), s = e.reduce((a, b) => a + b, 0);
    return e.map((a) => a / s);
  }

  /** Ingeniería de características idéntica a la de Python (entrenar_red_neuronal.py). */
  function ingenieria(r, model) {
    const d = Object.assign({}, r);
    const C = model.constantes;
    d.kwp_calc = (r.num_paneles_estimados * r.potencia_panel_w) / 1000;
    d.carga_familiar = (r.num_menores + r.num_adultos_mayores) / r.num_personas;
    d.ratio_consumo_ingreso_pct = (100 * r.consumo_kwh_mes * r.tarifa_kwh_cop) / r.ingreso_mensual_cop;
    d.kwh_por_persona = r.consumo_kwh_mes / r.num_personas;
    d.kwh_por_m2 = r.consumo_kwh_mes / r.area_vivienda_m2;
    const rpp = model.ref_pp[String(r.estrato)], rm2 = model.ref_m2[String(r.estrato)];
    const idx = 100 * (1 - 0.5 * (d.kwh_por_persona / (2 * rpp) + d.kwh_por_m2 / (2 * rm2)));
    d.indice_eficiencia_vivienda = Math.min(100, Math.max(0, idx));
    d.cobertura_solar_pct = (100 * d.kwp_calc * C.HSP_REF * 30 * C.PR_REF) / r.consumo_kwh_mes;
    d.brecha_digital = (r.tiene_internet === "No" ? 1 : 0) + (r.tiene_smartphone === "No" ? 1 : 0);
    return d;
  }

  /** Estandariza las variables numéricas y codifica las categóricas (one-hot con categorías fijas). */
  function vectorizar(spec, d) {
    const v = [];
    spec.num.forEach((c) => {
      let x = Number(d[c.name]);
      if (c.log1p) x = Math.log1p(x);
      v.push((x - c.mean) / c.std);
    });
    spec.cat.forEach((c) => {
      const val = String(d[c.name]);
      c.categories.forEach((k) => v.push(k === val ? 1 : 0));
    });
    return v;
  }

  function miembro(m, xt, xs) {
    const t2 = relu(dense(relu(dense(xt, m.t1)), m.t2));
    const econ = dense(t2, m.econ);
    const s2 = relu(dense(relu(dense(xs, m.s1)), m.s2));
    const z = s2.concat(t2, econ);
    const p = softmax(dense(relu(dense(relu(dense(z, m.a1)), m.a2)), m.adopcion));
    return { p, econ };
  }

  const CAMPOS_NUM = ["estrato", "num_personas", "num_menores", "num_adultos_mayores", "ingreso_mensual_cop", "consumo_kwh_mes", "tarifa_kwh_cop",
    "area_vivienda_m2", "area_cubierta_m2", "inclinacion_cubierta_grados", "num_paneles_estimados", "potencia_panel_w", "ratio_diurno_6_17"];

  function validar(r) {
    const faltan = CAMPOS_NUM.filter((c) => r[c] === undefined || r[c] === null || r[c] === "" || !isFinite(Number(r[c])));
    if (faltan.length) throw new Error("Faltan o no son numéricos: " + faltan.join(", "));
    ["num_personas", "consumo_kwh_mes", "ingreso_mensual_cop", "area_vivienda_m2", "tarifa_kwh_cop", "num_paneles_estimados", "potencia_panel_w"].forEach((c) => {
      if (Number(r[c]) <= 0) throw new Error(c + " debe ser mayor que cero");
    });
    if (Number(r.num_menores) + Number(r.num_adultos_mayores) >= Number(r.num_personas))
      throw new Error("num_menores + num_adultos_mayores debe ser menor que num_personas");
  }

  /** Predice adopción (3 clases), economía (ahorro, retorno, % ahorro) y la incertidumbre del ensamble. */
  function predecir(model, entrada, opciones) {
    opciones = opciones || {};
    const r = {};
    Object.keys(entrada).forEach((k) => { r[k] = CAMPOS_NUM.indexOf(k) >= 0 ? Number(entrada[k]) : entrada[k]; });
    if (r.ratio_diurno_6_17 === undefined && r.ratio_diurno_pct !== undefined) r.ratio_diurno_6_17 = Number(r.ratio_diurno_pct) / 100;
    validar(r);
    const d = ingenieria(r, model);
    const xt = vectorizar(model.prep_tecnico, d), xs = vectorizar(model.prep_social, d);
    const res = model.ensamble.map((m) => miembro(m, xt, xs));
    const n = res.length, P = [0, 0, 0], E = [0, 0, 0];
    res.forEach((o) => { for (let k = 0; k < 3; k++) { P[k] += o.p[k] / n; E[k] += o.econ[k] / n; } });
    const sd = [0, 1, 2].map((k) => Math.sqrt(res.reduce((a, o) => a + Math.pow(o.p[k] - P[k], 2), 0) / n));
    const econ = E.map((v, j) => v * model.econ_std[j] + model.econ_media[j]);
    const factura = r.consumo_kwh_mes * r.tarifa_kwh_cop * 12;
    const ahorro = Math.min(Math.max(econ[0], 0), 0.8 * factura);
    const kwp = d.kwp_calc, areaReq = (r.num_paneles_estimados * r.potencia_panel_w) / 205;
    const avisos = [];
    if (areaReq > 0.75 * r.area_cubierta_m2) avisos.push("El área requerida (" + areaReq.toFixed(1) + " m²) supera el 75 % de la cubierta: revisar viabilidad física.");
    if (r.consumo_kwh_mes < 60 || r.consumo_kwh_mes > 280) avisos.push("El consumo está fuera del rango de entrenamiento (60-280 kWh/mes): la predicción es menos confiable.");
    const costoKwp = opciones.costoKwp || null;
    const inversion = costoKwp ? kwp * costoKwp : null;
    let clase = 0; for (let k = 1; k < 3; k++) if (P[k] > P[clase]) clase = k;
    return {
      clase: CLASES[clase],
      probabilidades: { "No": P[0], "Tal vez": P[1], "Sí": P[2] },
      incertidumbre: { "No": sd[0], "Tal vez": sd[1], "Sí": sd[2] },
      probabilidad_interes: 1 - P[0],
      economia: { ahorro_anual_cop: ahorro, ahorro_anual_sin_tope_cop: econ[0], retorno_simple_anios: Math.max(econ[1], 0), porcentaje_ahorro: Math.min(Math.max(econ[2], 0), 80),
                  factura_anual_cop: factura, kwp: kwp, area_requerida_m2: areaReq, inversion_referencial_cop: inversion },
      avisos: avisos, modelo: model.nombre + " (ensamble de " + n + " redes)"
    };
  }
  return { predecir, ingenieria, vectorizar, CLASES };
});
