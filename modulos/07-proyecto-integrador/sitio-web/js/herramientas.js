/*! Optimización de subsidios (programación entera exacta) y simulación de RAEE fotovoltaico. UMD: navegador y Node. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Herramientas = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /** Asigna subsidios a los estratos 1-3 maximizando un beneficio lineal con presupuesto y equidad mínima en E1.
   *  Para cada (x1, x2) el mejor x3 es el mayor entero factible (el beneficio es creciente), por lo que la búsqueda es EXACTA. */
  function optimizar(cfg, p) {
    const sub = { 1: p.sub1, 2: p.sub2, 3: p.sub3 };
    const tw = Math.max(p.w_en + p.w_hog + p.w_ah, 1e-9), w = { en: p.w_en / tw, hog: p.w_hog / tw, ah: p.w_ah / tw };
    const FV = (1 - Math.pow(1 - cfg.degradacion, cfg.vida_util)) / cfg.degradacion;           // suma geométrica de la degradación
    const F10 = (1 - Math.pow(1.05 * (1 - cfg.degradacion), 10)) / (1 - 1.05 * (1 - cfg.degradacion));
    const E = {}, par = {};
    [1, 2, 3].forEach((s) => {
      const q = cfg.estratos[s];
      par[s] = { costo: q.inversion * sub[s], energia: q.gen_anual * FV, ahorro10: q.ahorro_anual * F10, cap: q.elegibles, inversion: q.inversion };
      par[s].co2 = (par[s].energia * cfg.fe_co2) / 1000;
    });
    const emax = Math.max(par[1].energia, par[2].energia, par[3].energia), amax = Math.max(par[1].ahorro10, par[2].ahorro10, par[3].ahorro10);
    [1, 2, 3].forEach((s) => { par[s].b = w.en * par[s].energia / emax + w.hog + w.ah * par[s].ahorro10 / amax; });
    const B = p.presupuesto_mm * 1e6, m = p.min_e1;
    let best = null;
    const max1 = Math.min(par[1].cap, par[1].costo > 0 ? Math.floor(B / par[1].costo) : par[1].cap);
    for (let x1 = 0; x1 <= max1; x1++) {
      const g1 = par[1].costo * x1;
      const max2 = Math.min(par[2].cap, par[2].costo > 0 ? Math.floor((B - g1) / par[2].costo) : par[2].cap);
      for (let x2 = 0; x2 <= max2; x2++) {
        const g12 = g1 + par[2].costo * x2;
        let x3 = par[3].costo > 0 ? Math.floor((B - g12 + 1e-6) / par[3].costo) : par[3].cap;
        if (m > 0) {
          const lim = (g1 * (1 - m) / m - par[2].costo * x2);             // c1x1 >= m * (gasto total)
          if (lim < -1e-6) continue;
          x3 = Math.min(x3, par[3].costo > 0 ? Math.floor(lim / par[3].costo + 1e-9) : par[3].cap);
        }
        x3 = Math.max(0, Math.min(x3, par[3].cap));
        const val = par[1].b * x1 + par[2].b * x2 + par[3].b * x3;
        if (!best || val > best.val + 1e-9) best = { val, x: [x1, x2, x3] };
      }
    }
    if (!best) return null;
    const filas = [1, 2, 3].map((s, i) => {
      const n = best.x[i], q = par[s];
      return { estrato: "E" + s, subsidio_pct: Math.round(sub[s] * 100), sistemas: n, gasto: q.costo * n, inversion_total: q.inversion * n, energia_mwh: q.energia * n / 1000, co2_t: q.co2 * n, ahorro10: q.ahorro10 * n };
    });
    const tot = filas.reduce((a, f) => ({ sistemas: a.sistemas + f.sistemas, gasto: a.gasto + f.gasto, inversion_total: a.inversion_total + f.inversion_total, energia_mwh: a.energia_mwh + f.energia_mwh, co2_t: a.co2_t + f.co2_t, ahorro10: a.ahorro10 + f.ahorro10 }),
      { sistemas: 0, gasto: 0, inversion_total: 0, energia_mwh: 0, co2_t: 0, ahorro10: 0 });
    return { filas, total: tot, par };
  }

  /* ---------------------------------------------------------------- RAEE fotovoltaico */
  const MODOS = ["Weibull regular (α=5,38; β=30 años)", "Pérdida temprana ilustrativa (α=2,5; β=18 años)", "Retiro programado a la vida útil"];
  const COMPOSICION = { "Vidrio": 0.70, "Aluminio": 0.18, "Polímeros": 0.07, "Silicio": 0.03, "Cobre": 0.01, "Otros metales": 0.01 };
  const RECUP = { "Vidrio": 0.85, "Aluminio": 0.95, "Polímeros": 0.0, "Silicio": 0.70, "Cobre": 0.90, "Otros metales": 0.50 };
  const F = (t, a, b) => 1 - Math.exp(-Math.pow(Math.max(t, 0) / b, a));

  function raee(p) {
    const ini = p.anio_ini || 2026, fin = p.anio_fin || 2030, hor = p.horizonte || 2065;
    const cohortes = []; for (let y = ini; y <= fin; y++) cohortes.push(y);
    const w = cohortes.map((_, i) => 1 / (1 + Math.exp(-(-2 + (4 * i) / Math.max(cohortes.length - 1, 1))))), sw = w.reduce((a, b) => a + b, 0);
    const inst = w.map((x) => (p.sistemas * x) / sw);
    const masaPanel = p.potencia_w * 0.052, anios = [], filas = [];
    for (let y = ini; y <= hor; y++) anios.push(y);
    anios.forEach((y) => {
      let pan = 0, inv = 0;
      cohortes.forEach((c, i) => {
        const edad = y - c; if (edad < 0) return;
        const nPan = inst[i] * p.paneles_por_sistema;
        let f;
        if (p.modo === 2) f = edad === p.vida ? 1 : 0;
        else { const [a, b] = p.modo === 0 ? [5.38, 30] : [2.5, 18]; f = F(edad + 1, a, b) - F(edad, a, b); }
        pan += nPan * f; inv += inst[i] * (F(edad + 1, 3, 13) - F(edad, 3, 13));
      });
      const resPan = (pan * masaPanel) / 1000, resInv = (inv * 8) / 1000;
      let rec = 0; const mat = {};
      Object.keys(COMPOSICION).forEach((k) => { mat[k] = resPan * COMPOSICION[k] * Math.min(1, RECUP[k] * p.recuperacion); rec += mat[k]; });
      filas.push({ anio: y, paneles: pan, inversores: inv, residuo_paneles_t: resPan, residuo_inversores_t: resInv, residuo_total_t: resPan + resInv, recuperable_t: rec, disposicion_t: resPan - rec + resInv, materiales: mat });
    });
    const tot = filas.reduce((a, f) => a + f.residuo_total_t, 0), rec = filas.reduce((a, f) => a + f.recuperable_t, 0);
    const pico = filas.reduce((a, f) => (f.residuo_total_t > a.residuo_total_t ? f : a), filas[0]);
    const mats = {}; Object.keys(COMPOSICION).forEach((k) => { mats[k] = filas.reduce((a, f) => a + f.materiales[k], 0); });
    return { filas, total_t: tot, paneles_t: filas.reduce((a, f) => a + f.residuo_paneles_t, 0), inversores_t: filas.reduce((a, f) => a + f.residuo_inversores_t, 0), recuperable_t: rec, pico, materiales: mats, masa_panel_kg: masaPanel };
  }
  return { optimizar, raee, MODOS, COMPOSICION, RECUP };
});
