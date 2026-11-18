/* Tablero Solar Popayán · SolarNet-MT. Todo corre en el navegador: la red neuronal se evalúa con solarnet.js. */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  function h(tag, attrs) {
    const e = document.createElement(tag), kids = Array.prototype.slice.call(arguments, 2);
    if (attrs) Object.keys(attrs).forEach((k) => {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
      if (k === "class") e.className = attrs[k]; else if (k === "html") e.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]);
    });
    kids.reduce((a, b) => a.concat(b), []).forEach((c) => { if (c !== null && c !== undefined && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c))); });
    return e;
  }
  const nf = (x, d) => Number(x).toLocaleString("es-CO", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  const pc = (x, d) => nf(100 * x, d === undefined ? 1 : d) + " %";
  const M = (x, d) => "$" + nf(x / 1e6, d === undefined ? 1 : d) + " M";
  const COLOR = { 1: "#c0392b", 2: "#e6a817", 3: "#2471a3", No: "#c0392b", "Tal vez": "#e6a817", "Sí": "#1e8449" };
  const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const TXT = dark ? "#e8edf2" : "#1d2733", GRID = dark ? "#26313d" : "#e3e8ee";

  function plot(el, data, layout, cfg) {
    if (!window.Plotly) { el.textContent = "No se pudo cargar la librería de gráficos (Plotly). Revise la conexión."; return; }
    const base = { margin: { l: 55, r: 12, t: 42, b: 52 }, font: { family: "system-ui, sans-serif", color: TXT, size: 12 }, paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { gridcolor: GRID, zerolinecolor: GRID, automargin: true }, yaxis: { gridcolor: GRID, zerolinecolor: GRID, automargin: true }, legend: { orientation: "h", y: -0.22 }, height: 340 };
    const L = Object.assign({}, base, layout || {});
    L.xaxis = Object.assign({}, base.xaxis, (layout || {}).xaxis); L.yaxis = Object.assign({}, base.yaxis, (layout || {}).yaxis);
    window.Plotly.newPlot(el, data, L, Object.assign({ responsive: true, displaylogo: false }, cfg || {}));
  }
  const pl = (id, h_) => h("div", { class: "plot", id: id, style: h_ ? "min-height:" + h_ + "px" : "" });
  const kpi = (v, l, s, cls) => h("div", { class: "kpi" }, h("div", { class: "v " + (cls || "") }, v), h("div", { class: "l" }, l), s ? h("div", { class: "s" }, s) : null);
  function tabla(cols, rows, cls) {
    return h("div", { class: "scroll" }, h("table", { class: cls || "" }, h("thead", null, h("tr", null, cols.map((c) => h("th", null, c)))),
      h("tbody", null, rows.map((r) => h("tr", null, r.map((c) => h("td", null, c)))))));
  }

  let R, N, MODEL;
  const PANELS = [];
  function defTab(id, titulo, render) { PANELS.push({ id: id, titulo: titulo, render: render, hecho: false }); }

  /* ============================================================ 1. Resumen */
  defTab("resumen", "Resumen", function (p) {
    const e = R.estratos, g = R.global, bo = N.binarias_oof, o = N.oof;
    p.append(h("h2", null, "Autogeneración solar en hogares de Popayán"), h("p", { class: "lead" }, "Predicción con una red neuronal multitarea, optimización de subsidios y economía circular. Todo se calcula en su navegador."));
    p.append(h("div", { class: "grid g4" },
      kpi(nf(R.n_hogares), "hogares sintéticos", "estratos 1 a 3"),
      kpi(pc(bo.si_vs_resto.exactitud, 1), "exactitud ¿Sí o no?", "fuera de muestra (1.000 hogares)", "ok"),
      kpi(pc(o.exactitud, 1), "exactitud en 3 clases", "No · Tal vez · Sí", ""),
      kpi(nf(N.regresion_prueba.ahorro_anual_cop.r2, 2), "R² del ahorro anual", "cabeza económica de la red", "ok")));
    p.append(h("h3", null, "Lo que muestran los resultados"));
    p.append(h("div", { class: "card" }, h("ul", null,
      h("li", null, h("b", null, "La economía depende del estrato: "), "el retorno simple medio es de " + nf(e[0].retorno, 1) + ", " + nf(e[1].retorno, 1) + " y " + nf(e[2].retorno, 1) + " años en los estratos 1, 2 y 3; el VPN a 10 años es positivo en el " + nf(e[0].vpn_positivo, 1) + " %, " + nf(e[1].vpn_positivo, 1) + " % y " + nf(e[2].vpn_positivo, 1) + " % de los hogares."),
      h("li", null, h("b", null, "El estrato 1 ahorra más en proporción, pero invierte más en proporción: "), "el sistema equivale a " + nf(e[0].meses_ingreso, 1) + " meses de ingreso en el estrato 1, frente a " + nf(e[2].meses_ingreso, 1) + " en el estrato 3."),
      h("li", null, h("b", null, "La barrera principal es el costo: "), nf(100 * R.pareto.hogares[0] / R.pareto.n, 0) + " % de los hogares sin adopción clara, y las dos primeras barreras suman " + nf(R.pareto.acumulado[1], 0) + " %."),
      h("li", null, h("b", null, "Dilema de equidad en los subsidios: "), "la asignación más eficiente concentra el gasto en el estrato 3; exigir equidad tiene un costo medible (pestaña Subsidios)."))));
    p.append(h("div", { class: "note" }, h("b", null, "Sobre la exactitud. "), "La decisión de adoptar se generó con una parte aleatoria; por eso ningún modelo puede acertar siempre. Con este conjunto de datos, la red alcanza " + pc(o.exactitud, 1) + " en tres clases (la clase intermedia, \"Tal vez\", es ambigua por naturaleza) y " + pc(bo.si_vs_resto.exactitud, 1) + " al preguntar solo \"¿Sí o no?\". Los detalles y límites están en la pestaña Red neuronal."));
    p.append(h("div", { class: "info" }, "Datos sintéticos (archivo " + R.archivo + "). No contienen personas reales. Si se usaran datos reales de hogares, deberá cumplirse la Ley 1581 de 2012."));
  });

  /* ============================================================ 2. Hogares */
  defTab("datos", "Hogares", function (p) {
    p.append(h("h2", null, "Perfil de los hogares"), h("p", { class: "lead" }, "Consumo, economía y barreras por estrato."));
    p.append(h("div", { class: "grid g2" }, h("div", { class: "card" }, pl("pl-ret")), h("div", { class: "card" }, pl("pl-box"))));
    p.append(h("div", { class: "grid g2" }, h("div", { class: "card" }, pl("pl-edu")), h("div", { class: "card" }, pl("pl-hor"))));
    p.append(h("div", { class: "card" }, pl("pl-par")));
    p.append(h("h3", null, "Indicadores por estrato"));
    p.append(h("div", { class: "card" }, tabla(["Indicador", "Estrato 1", "Estrato 2", "Estrato 3"], [
      ["Hogares"].concat(R.estratos.map((e) => nf(e.hogares))), ["Consumo (kWh/mes)"].concat(R.estratos.map((e) => nf(e.consumo, 1))),
      ["Ingreso medio (COP/mes)"].concat(R.estratos.map((e) => nf(e.ingreso))), ["Inversión media"].concat(R.estratos.map((e) => M(e.inversion, 2))),
      ["Ahorro anual medio (COP)"].concat(R.estratos.map((e) => nf(e.ahorro_anual))), ["Retorno simple (años)"].concat(R.estratos.map((e) => nf(e.retorno, 1))),
      ["VPN a 10 años > 0 (%)"].concat(R.estratos.map((e) => nf(e.vpn_positivo, 1))), ["Requieren financiación (%)"].concat(R.estratos.map((e) => nf(e.requiere_fin, 1))),
      ["Tienen internet (%)"].concat(R.estratos.map((e) => nf(e.internet, 1))), ["Dispuestos \"Sí\" (%)"].concat(R.estratos.map((e) => nf(e.si, 1)))])));
    setTimeout(function () {
      const x = R.estratos.map((e) => "Estrato " + e.estrato);
      plot($("#pl-ret"), [{ x: x, y: R.estratos.map((e) => e.retorno), type: "bar", name: "Retorno simple (años)", marker: { color: [1, 2, 3].map((k) => COLOR[k]) }, text: R.estratos.map((e) => nf(e.retorno, 1)), textposition: "outside" }],
        { title: { text: "Retorno simple de la inversión (años)", font: { size: 14 } }, yaxis: { rangemode: "tozero" } });
      plot($("#pl-box"), [1, 2, 3].map((k) => { const b = R.consumo_box[String(k)]; return { type: "box", name: "Estrato " + k, q1: [b[1]], median: [b[2]], q3: [b[3]], lowerfence: [b[0]], upperfence: [b[4]], marker: { color: COLOR[k] } }; }),
        { title: { text: "Consumo mensual (kWh)", font: { size: 14 } }, showlegend: false });
      const ed = Object.keys(R.educacion_si), ordenEd = ["Primaria", "Secundaria", "Técnico", "Universitario"].filter((k) => ed.indexOf(k) >= 0);
      plot($("#pl-edu"), [{ x: ordenEd, y: ordenEd.map((k) => R.educacion_si[k]), type: "bar", marker: { color: "#1e8449" }, text: ordenEd.map((k) => nf(R.educacion_si[k], 0) + " %"), textposition: "outside" }],
        { title: { text: "Hogares dispuestos (\"Sí\") según educación del jefe (%)", font: { size: 14 } }, yaxis: { range: [0, 100] } });
      plot($("#pl-hor"), [1, 2, 3].map((k) => ({ x: Array.from({ length: 24 }, (_, i) => i), y: R.perfil_horario[String(k)], mode: "lines", name: "Estrato " + k, line: { color: COLOR[k], width: 2 } })),
        { title: { text: "Perfil horario medio de consumo (Wh por hora)", font: { size: 14 } }, xaxis: { title: "Hora del día", dtick: 3 } });
      const P = R.pareto;
      plot($("#pl-par"), [{ x: P.categorias, y: P.hogares, type: "bar", name: "Hogares", marker: { color: "#c0392b" } }, { x: P.categorias, y: P.acumulado, type: "scatter", mode: "lines+markers", name: "% acumulado", yaxis: "y2", line: { color: "#2471a3" } }],
        { title: { text: "Pareto de la principal barrera (n = " + P.n + " hogares sin respuesta \"Sí\")", font: { size: 14 } }, yaxis2: { overlaying: "y", side: "right", range: [0, 105], title: "% acumulado" }, shapes: [{ type: "line", xref: "paper", x0: 0, x1: 1, yref: "y2", y0: 80, y1: 80, line: { dash: "dash", color: "gray" } }] });
    }, 0);
  });

  /* ============================================================ 3. Red neuronal */
  function diagrama() {
    const W = (n) => MODEL.ensamble[0][n], dims = (n) => [W(n).W.length, W(n).b.length];
    const t1 = dims("t1"), t2 = dims("t2"), ec = dims("econ"), s1 = dims("s1"), s2 = dims("s2"), a1 = dims("a1"), a2 = dims("a2"), out = dims("adopcion");
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 760 330"); svg.setAttribute("class", "arq"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Arquitectura SolarNet-MT");
    const box = (x, y, w, hh, cls, l1, l2) => { const g = document.createElementNS(ns, "g"); const r = document.createElementNS(ns, "rect"); [["x", x], ["y", y], ["width", w], ["height", hh], ["rx", 8], ["class", cls]].forEach((a) => r.setAttribute(a[0], a[1])); g.append(r);
      [[l1, y + hh / 2 - (l2 ? 3 : -4), 700], [l2, y + hh / 2 + 11, 400]].forEach((t) => { if (!t[0]) return; const te = document.createElementNS(ns, "text"); te.setAttribute("x", x + w / 2); te.setAttribute("y", t[1]); te.setAttribute("text-anchor", "middle"); te.setAttribute("font-weight", t[2]); te.textContent = t[0]; g.append(te); }); svg.append(g); };
    const arrow = (x1, y1, x2, y2) => { const l = document.createElementNS(ns, "line"); [["x1", x1], ["y1", y1], ["x2", x2], ["y2", y2], ["marker-end", "url(#fl)"]].forEach((a) => l.setAttribute(a[0], a[1])); svg.append(l); };
    svg.insertAdjacentHTML("afterbegin", '<defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" style="fill:#7f8c8d;stroke:none"/></marker></defs>');
    box(8, 40, 112, 56, "b", "Rama técnica", t1[0] + " entradas"); box(8, 190, 112, 56, "b", "Rama social", s1[0] + " entradas");
    box(150, 40, 100, 56, "b", "Densa " + t1[1], "ReLU"); box(280, 40, 100, 56, "b", "Densa " + t2[1], "ReLU"); box(420, 4, 150, 56, "e", "Económica (" + ec[1] + ")", "ahorro · retorno · % ahorro");
    box(150, 190, 100, 56, "b", "Densa " + s1[1], "ReLU + Dropout"); box(280, 190, 100, 56, "b", "Densa " + s2[1], "ReLU");
    box(430, 110, 110, 70, "b", "Concatenar", (s2[1] + t2[1] + ec[1]) + " valores"); box(560, 110, 90, 70, "b", "Densa " + a1[1], "ReLU + Dropout"); box(660, 110, 90, 70, "b", "Densa " + a2[1], "ReLU");
    box(560, 230, 190, 56, "o", "Softmax (" + out[1] + ")", "No · Tal vez · Sí");
    arrow(120, 68, 150, 68); arrow(250, 68, 280, 68); arrow(380, 60, 420, 40); arrow(120, 218, 150, 218); arrow(250, 218, 280, 218); arrow(380, 218, 430, 160); arrow(330, 96, 430, 130);
    arrow(495, 60, 485, 110); arrow(540, 145, 560, 145); arrow(650, 145, 660, 145); arrow(705, 180, 705, 230);
    const t = document.createElementNS(ns, "text"); t.setAttribute("x", 8); t.setAttribute("y", 318); t.textContent = "Ensamble profundo: " + MODEL.ensamble.length + " redes con distinta semilla; se promedian sus probabilidades y su desviación mide la incertidumbre. " + nf(N.n_parametros) + " parámetros por red.";
    svg.append(t); return svg;
  }
  defTab("red", "Red neuronal", function (p) {
    const mt = N.metricas_prueba, oo = N.oof, bo = N.binarias_oof, bt = N.binarias_prueba;
    p.append(h("h2", null, "Red neuronal SolarNet-MT"), h("p", { class: "lead" }, "Multitarea: predice a la vez el impacto económico (ahorro, retorno, % de ahorro) y la disposición del hogar a instalar paneles. La rama económica alimenta la decisión de adopción."));
    p.append(h("div", { class: "card" }, diagrama()));
    p.append(h("h3", null, "Desempeño"));
    p.append(h("div", { class: "grid g4" }, kpi(pc(oo.exactitud), "exactitud, 3 clases", "1.000 hogares fuera de muestra"), kpi(pc(bo.si_vs_resto.exactitud), "exactitud ¿Sí o no?", "AUC " + nf(bo.si_vs_resto.auc, 2), "ok"),
      kpi(pc(bo.interes_vs_no.exactitud), "exactitud ¿hay interés?", "Sí o Tal vez frente a No", "ok"), kpi(nf(oo.auc_macro, 3), "AUC macro (3 clases)", "ECE " + nf(oo.ece, 3))));
    p.append(h("div", { class: "info" }, "En el 20 % de prueba (", N.n_prueba, " hogares) la exactitud en 3 clases es ", pc(mt.exactitud), " (± 3,4 puntos por el tamaño de la muestra). Las cifras de 1.000 hogares usan validación cruzada de 5 pliegues y son más estables."));
    p.append(h("div", { class: "note" }, h("b", null, "Por qué no es 90 %. "), "La respuesta de cada hogar se generó con un componente aleatorio. Si un modelo conociera la regla exacta con que se crearon los datos, su exactitud máxima en 3 clases estaría cerca de 73 % para este conjunto; la red alcanza " + pc(oo.exactitud, 0) + ". La clase \"Tal vez\" (franja intermedia) casi nunca se predice (sensibilidad " + pc(N.recall_por_clase_oof["Tal vez"], 0) + "), por eso se reportan también las preguntas binarias. Con datos reales los valores serían distintos."));
    p.append(h("h3", null, "Comparación de arquitecturas (validación cruzada, 5 pliegues)"));
    p.append(h("div", { class: "card" }, tabla(["Arquitectura", "Exactitud", "± sd", "AUC", "F1 macro", "Pérdida log."], N.arquitecturas_cv.map((a) => [a.arquitectura + (a.arquitectura === N.arquitectura_elegida ? " ✔" : ""), pc(a.exactitud_cv), nf(100 * a.exactitud_cv_sd, 1), nf(a.auc_cv, 3), nf(a.f1_macro_cv, 3), nf(a.log_loss_cv, 3)])),
      h("p", { class: "lead" }, "La selección usa la pérdida logarítmica (a igualdad práctica se prefiere la arquitectura de dos ramas, que expone las predicciones económicas intermedias).")));
    p.append(h("h3", null, "Frente a líneas base clásicas (mismos insumos, 20 % de prueba)"));
    p.append(h("div", { class: "card" }, tabla(["Modelo", "Tipo", "Exactitud 3 clases", "AUC", "¿Sí o no?", "¿Interés?", "Brier"], N.comparacion.map((c) => [c.modelo, c.tipo, pc(c.exactitud), nf(c.auc_macro, 3), pc(c.binarias.si_vs_resto.exactitud), pc(c.binarias.interes_vs_no.exactitud), nf(c.brier, 3)])),
      h("p", { class: "lead" }, "Con 200 hogares de prueba las diferencias de 2 a 4 puntos están dentro del ruido. En datos tabulares pequeños una regresión logística suele ser un rival fuerte; el valor de la red está en la cascada económica y en el ensamble con incertidumbre.")));
    p.append(h("div", { class: "grid g2" }, h("div", { class: "card" }, pl("pl-roc")), h("div", { class: "card" }, pl("pl-cm"))));
    p.append(h("div", { class: "grid g2" }, h("div", { class: "card" }, pl("pl-cal")), h("div", { class: "card" }, pl("pl-his"))));
    p.append(h("div", { class: "card" }, pl("pl-imp", 420)));
    p.append(h("h3", null, "Cabeza económica (20 % de prueba)"));
    const rg = N.regresion_prueba;
    p.append(h("div", { class: "grid g3" }, kpi(nf(rg.ahorro_anual_cop.r2, 3), "R² ahorro anual", "MAE " + "$" + nf(rg.ahorro_anual_cop.mae) + " COP/año"), kpi(nf(rg.retorno_simple_anios.r2, 3), "R² retorno simple", "MAE " + nf(rg.retorno_simple_anios.mae, 2) + " años"), kpi(nf(rg.porcentaje_ahorro.r2, 3), "R² % de ahorro", "MAE " + nf(rg.porcentaje_ahorro.mae, 2) + " puntos")));
    p.append(h("div", { class: "note" }, "El R² es alto porque el ahorro de los datos sintéticos sigue reglas físicas casi deterministas; con datos medidos cabe esperar un valor menor."));
    p.append(h("h3", null, "Equidad (predicciones fuera de muestra)"));
    ["estrato", "zona", "genero_jefe"].forEach((k) => { const F = N.equidad[k]; p.append(h("div", { class: "card" }, h("b", null, { estrato: "Por estrato", zona: "Por zona", genero_jefe: "Por género del jefe de hogar" }[k] + " · impacto dispar " + nf(F.impacto_dispar, 2) + (F.impacto_dispar < 0.8 ? " ⚠" : " ✔")),
      tabla(["Grupo", "Hogares", "\"Sí\" real", "\"Sí\" predicho", "Sensibilidad", "Falsos +", "Exactitud"], F.filas.map((f) => [f.grupo, nf(f.n), pc(f.si_real, 0), pc(f.si_predicho, 0), f.tpr === null ? "–" : pc(f.tpr, 0), f.fpr === null ? "–" : pc(f.fpr, 0), pc(f.exactitud, 0)])))); });
    p.append(h("div", { class: "note" }, "Una sensibilidad baja en el estrato 1 significa que el modelo deja sin detectar a muchos adoptantes potenciales de menores ingresos: úselo como apoyo a la segmentación, nunca para excluir hogares."));
    setTimeout(function () {
      plot($("#pl-roc"), ["No", "Tal vez", "Sí"].map((c) => ({ x: N.roc[c].fpr, y: N.roc[c].tpr, mode: "lines", name: c + " (AUC " + nf(N.roc[c].auc, 2) + ")", line: { color: COLOR[c], width: 2 } })).concat([{ x: [0, 1], y: [0, 1], mode: "lines", line: { dash: "dash", color: "gray" }, showlegend: false }]),
        { title: { text: "Curvas ROC (uno contra resto)", font: { size: 14 } }, xaxis: { title: "Falsos positivos" }, yaxis: { title: "Sensibilidad" } });
      const cm = N.confusion, cls = ["No", "Tal vez", "Sí"], rs = cm.map((r) => r.reduce((a, b) => a + b, 0));
      plot($("#pl-cm"), [{ z: cm.map((r, i) => r.map((v) => v / rs[i])), x: cls, y: cls, type: "heatmap", colorscale: "Blues", showscale: false, text: cm.map((r, i) => r.map((v, j) => v + " (" + Math.round(100 * v / rs[i]) + " %)")), texttemplate: "%{text}", hoverinfo: "text" }],
        { title: { text: "Matriz de confusión (prueba)", font: { size: 14 } }, xaxis: { title: "Predicho", side: "bottom" }, yaxis: { title: "Real", autorange: "reversed" } });
      plot($("#pl-cal"), [{ x: N.calibracion.predicho, y: N.calibracion.observado, mode: "lines+markers", name: "Red", line: { color: "#2471a3" } }, { x: [0, 1], y: [0, 1], mode: "lines", line: { dash: "dash", color: "gray" }, name: "Calibración perfecta" }],
        { title: { text: "Calibración de P(Sí) (ECE " + nf(mt.ece, 3) + ")", font: { size: 14 } }, xaxis: { title: "Probabilidad predicha", range: [0, 1] }, yaxis: { title: "Frecuencia observada", range: [0, 1] } });
      const hs = N.historia, ep = hs.loss.map((_, i) => i + 1);
      plot($("#pl-his"), [{ x: ep, y: hs.loss, mode: "lines", name: "Entrenamiento", line: { color: "#2471a3" } }, { x: ep, y: hs.val_loss, mode: "lines", name: "Validación", line: { color: "#c0392b" } }],
        { title: { text: "Curvas de aprendizaje (una red del ensamble)", font: { size: 14 } }, xaxis: { title: "Época" }, yaxis: { title: "Pérdida" } });
      const im = N.importancia.slice().reverse();
      plot($("#pl-imp"), [{ y: im.map((i) => i.variable), x: im.map((i) => i.delta_log_loss), type: "bar", orientation: "h", marker: { color: "#e08a00" } }],
        { title: { text: "Importancia por permutación (aumento de la pérdida logarítmica)", font: { size: 14 } }, margin: { l: 190, r: 12, t: 42, b: 46 }, height: 420 });
    }, 0);
  });

  /* ============================================================ 4. Simulador */
  const GRUPOS = [
    { t: "Hogar", f: [["estrato", "Estrato", "sel", [1, 2, 3]], ["zona", "Zona", "cat"], ["num_personas", "Personas", "num", 1, 8, 1], ["num_menores", "Menores", "num", 0, 4, 1], ["num_adultos_mayores", "Adultos mayores", "num", 0, 2, 1],
      ["ingreso_mensual_cop", "Ingreso mensual (COP)", "num", 300000, 5000000, 10000], ["nivel_educativo", "Educación del jefe", "cat"], ["ocupacion_principal", "Ocupación", "cat"], ["tiene_empresa", "Tiene empresa", "cat"]] },
    { t: "Vivienda y cubierta", f: [["area_vivienda_m2", "Área de vivienda (m²)", "num", 30, 250, 1], ["area_cubierta_m2", "Área de cubierta (m²)", "num", 15, 130, 1], ["tipo_cubierta", "Tipo de cubierta", "cat"], ["orientacion_cubierta", "Orientación", "cat"],
      ["inclinacion_cubierta_grados", "Inclinación (°)", "num", 5, 35, 1], ["sombras_presentes", "Sombras", "cat"]] },
    { t: "Consumo eléctrico", f: [["consumo_kwh_mes", "Consumo (kWh/mes)", "num", 40, 320, 1], ["tarifa_kwh_cop", "Tarifa (COP/kWh)", "num", 650, 1000, 1], ["ratio_diurno_pct", "% del consumo entre 6:00 y 18:00", "num", 30, 75, 0.5],
      ["recibe_subsidio", "Recibe subsidio", "cat"], ["tiene_medidor_inteligente", "Medidor inteligente", "cat"]] },
    { t: "Sistema fotovoltaico", f: [["num_paneles_estimados", "Nº de paneles", "num", 1, 14, 1], ["potencia_panel_w", "Potencia del panel (W)", "selnum", [400, 430, 450, 500, 525, 550]]] },
    { t: "Perfil digital y comunitario", f: [["tiene_internet", "Internet", "cat"], ["tiene_smartphone", "Smartphone", "cat"], ["conoce_reciclaje_paneles", "Conoce el reciclaje de paneles", "cat"], ["interes_comunidad_energetica", "Interés en comunidad energética", "cat"]] }];
  const PRESETS = {
    "Estrato 1 rural": { estrato: 1, zona: "Rural", num_personas: 4, num_menores: 1, num_adultos_mayores: 0, ingreso_mensual_cop: 700000, nivel_educativo: "Secundaria", ocupacion_principal: "Independiente", tiene_empresa: "No", area_vivienda_m2: 60, area_cubierta_m2: 45, tipo_cubierta: "Zinc", orientacion_cubierta: "Sur", inclinacion_cubierta_grados: 15, sombras_presentes: "No", consumo_kwh_mes: 85, tarifa_kwh_cop: 740, ratio_diurno_pct: 55, recibe_subsidio: "Sí", tiene_medidor_inteligente: "No", num_paneles_estimados: 3, potencia_panel_w: 450, tiene_internet: "No", tiene_smartphone: "Sí", conoce_reciclaje_paneles: "No", interes_comunidad_energetica: "Sí" },
    "Estrato 2 urbano": { estrato: 2, zona: "Urbana", num_personas: 3, num_menores: 1, num_adultos_mayores: 0, ingreso_mensual_cop: 1650000, nivel_educativo: "Técnico", ocupacion_principal: "Empleado", tiene_empresa: "No", area_vivienda_m2: 80, area_cubierta_m2: 60, tipo_cubierta: "Teja de barro", orientacion_cubierta: "Norte", inclinacion_cubierta_grados: 25, sombras_presentes: "No", consumo_kwh_mes: 135, tarifa_kwh_cop: 810, ratio_diurno_pct: 52, recibe_subsidio: "Sí", tiene_medidor_inteligente: "No", num_paneles_estimados: 4, potencia_panel_w: 450, tiene_internet: "Sí", tiene_smartphone: "Sí", conoce_reciclaje_paneles: "No", interes_comunidad_energetica: "No" },
    "Estrato 3 urbano": { estrato: 3, zona: "Urbana", num_personas: 3, num_menores: 0, num_adultos_mayores: 1, ingreso_mensual_cop: 3200000, nivel_educativo: "Universitario", ocupacion_principal: "Empleado", tiene_empresa: "No", area_vivienda_m2: 110, area_cubierta_m2: 75, tipo_cubierta: "Losa de concreto", orientacion_cubierta: "Plana", inclinacion_cubierta_grados: 5, sombras_presentes: "No", consumo_kwh_mes: 185, tarifa_kwh_cop: 890, ratio_diurno_pct: 50, recibe_subsidio: "No", tiene_medidor_inteligente: "Sí", num_paneles_estimados: 5, potencia_panel_w: 500, tiene_internet: "Sí", tiene_smartphone: "Sí", conoce_reciclaje_paneles: "Sí", interes_comunidad_energetica: "Sí" } };

  function categorias(nombre) {
    const todos = MODEL.prep_tecnico.cat.concat(MODEL.prep_social.cat), c = todos.filter((x) => x.name === nombre)[0];
    return c ? c.categories : [];
  }
  defTab("simulador", "Simulador", function (p) {
    p.append(h("h2", null, "Simulador con la red neuronal"), h("p", { class: "lead" }, "Describa un hogar y su sistema. La red estima la economía (ahorro y retorno) y la probabilidad de que el hogar responda No, Tal vez o Sí."));
    const form = h("form", { class: "f", onsubmit: function (ev) { ev.preventDefault(); calcular(); } });
    const inputs = {};
    GRUPOS.forEach((g) => {
      const fs = h("div", { class: "fields" });
      g.f.forEach((f) => {
        let el;
        if (f[2] === "num") el = h("input", { type: "number", min: f[3], max: f[4], step: f[5], inputmode: "decimal", required: "required" });
        else { const opts = f[2] === "cat" ? categorias(f[0]) : f[3]; el = h("select", null, opts.map((o) => h("option", { value: o }, o))); }
        inputs[f[0]] = el; fs.append(h("label", null, f[1], el));
      });
      form.append(h("fieldset", null, h("legend", null, g.t), fs));
    });
    function poner(v) { Object.keys(v).forEach((k) => { if (inputs[k]) inputs[k].value = v[k]; }); }
    function porDefecto() {
      const ra = N.rangos, md = N.modas;
      poner({ estrato: 1, zona: md.zona, num_personas: ra.num_personas[2], num_menores: 1, num_adultos_mayores: 0, ingreso_mensual_cop: ra.ingreso_mensual_cop[2], nivel_educativo: md.nivel_educativo, ocupacion_principal: md.ocupacion_principal, tiene_empresa: "No",
        area_vivienda_m2: ra.area_vivienda_m2[2], area_cubierta_m2: ra.area_cubierta_m2[2], tipo_cubierta: md.tipo_cubierta, orientacion_cubierta: md.orientacion_cubierta, inclinacion_cubierta_grados: ra.inclinacion_cubierta_grados[2], sombras_presentes: "No",
        consumo_kwh_mes: ra.consumo_kwh_mes[2], tarifa_kwh_cop: ra.tarifa_kwh_cop[2], ratio_diurno_pct: Math.round(ra.ratio_diurno_pct[2] * 2) / 2, recibe_subsidio: "Sí", tiene_medidor_inteligente: "No",
        num_paneles_estimados: ra.num_paneles_estimados[2], potencia_panel_w: 450, tiene_internet: "Sí", tiene_smartphone: "Sí", conoce_reciclaje_paneles: "No", interes_comunidad_energetica: "No" });
    }
    porDefecto();
    const pre = h("div", { class: "row" }, h("span", { class: "lead", style: "margin:0" }, "Ejemplos:"), Object.keys(PRESETS).map((k) => h("button", { type: "button", class: "btn sec", onclick: function () { poner(PRESETS[k]); calcular(); } }, k)));
    form.append(h("div", { class: "row" }, h("button", { class: "btn", type: "submit" }, "Predecir"), h("button", { type: "button", class: "btn sec", onclick: function () { porDefecto(); calcular(); } }, "Restablecer")));
    p.append(h("div", { class: "card" }, pre, form));
    const out = h("div", { id: "sim-out" }); p.append(out);

    function valores() {
      const v = {}; Object.keys(inputs).forEach((k) => { const e = inputs[k]; v[k] = e.tagName === "INPUT" || ["estrato", "potencia_panel_w"].indexOf(k) >= 0 ? Number(e.value) : e.value; }); return v;
    }
    function calcular() {
      out.textContent = "";
      let r, v = valores();
      try { r = window.SolarNet.predecir(MODEL, v, { costoKwp: R.costo_kwp_ref }); } catch (e) { out.append(h("div", { class: "note" }, "⚠️ " + e.message)); return; }
      const P = r.probabilidades, S = r.incertidumbre, E = r.economia, cl = ["No", "Tal vez", "Sí"];
      out.append(h("div", { class: "card" }, h("div", { class: "row" }, h("span", null, "Respuesta más probable:"), h("span", { class: "chip " + (r.clase === "Sí" ? "Si" : r.clase === "No" ? "No" : "TalVez") }, r.clase), h("span", { class: "lead", style: "margin:0" }, "P(interés: Sí o Tal vez) = " + pc(r.probabilidad_interes, 0))),
        pl("pl-sim", 300)));
      out.append(h("div", { class: "grid g4" }, kpi(M(E.ahorro_anual_cop, 2), "ahorro anual", pc(E.ahorro_anual_cop / E.factura_anual_cop, 0) + " de la factura", "ok"), kpi(nf(E.retorno_simple_anios, 1) + " años", "retorno simple", E.retorno_simple_anios > 12 ? "largo: requiere apoyo" : "razonable", E.retorno_simple_anios > 12 ? "warn" : "ok"),
        kpi(nf(E.kwp, 2) + " kWp", "sistema", nf(E.area_requerida_m2, 1) + " m² de paneles"), kpi(M(E.inversion_referencial_cop, 2), "inversión referencial", "costo mediano " + M(R.costo_kwp_ref, 2) + "/kWp")));
      E && r.avisos.forEach((a) => out.append(h("div", { class: "note" }, "⚠️ " + a)));
      out.append(h("div", { class: "info" }, "Modelo: " + r.modelo + ". Las barras de error son ±1 desviación entre las redes del ensamble. Resultado orientativo (datos sintéticos)."));
      setTimeout(function () {
        plot($("#pl-sim"), [{ x: cl, y: cl.map((c) => 100 * P[c]), type: "bar", marker: { color: cl.map((c) => COLOR[c]) }, error_y: { type: "data", array: cl.map((c) => 100 * S[c]), visible: true }, text: cl.map((c) => nf(100 * P[c], 0) + " %"), textposition: "outside" }],
          { title: { text: "Probabilidad de cada respuesta (%)", font: { size: 14 } }, yaxis: { range: [0, 105] }, height: 300 });
      }, 0);
    }
    calcular();
  });

  /* ============================================================ 5. Segmentos */
  defTab("segmentos", "Segmentos", function (p) {
    p.append(h("h2", null, "Segmentos de hogares (K-Means, k = 3)"), h("p", { class: "lead" }, "Agrupación por consumo, ingreso, tamaño del hogar, potencial solar y economía."));
    p.append(h("div", { class: "card" }, tabla(["Segmento", "Hogares", "Estrato medio", "Consumo (kWh)", "Ingreso (COP)", "Personas", "Retorno (años)", "Sí (%)", "VPN>0 (%)", "Rural (%)"],
      R.segmentos.map((s) => [s.segmento, nf(s.hogares), nf(s.estrato_medio, 1), nf(s.consumo, 0), nf(s.ingreso), nf(s.personas, 1), nf(s.retorno, 1), nf(s.si, 0), nf(s.vpn_positivo, 0), nf(s.rural, 0)]))));
    p.append(h("div", { class: "card" }, pl("pl-seg")));
    p.append(h("div", { class: "note" }, "La estructura de los grupos es débil (los hogares forman más un continuo que grupos separados): úsense como guía para diseñar ofertas, no como etiquetas rígidas."));
    setTimeout(function () {
      const x = R.segmentos.map((s) => s.segmento);
      plot($("#pl-seg"), [{ x: x, y: R.segmentos.map((s) => s.si), type: "bar", name: "Dispuestos \"Sí\" (%)", marker: { color: "#1e8449" } }, { x: x, y: R.segmentos.map((s) => s.vpn_positivo), type: "bar", name: "VPN a 10 años > 0 (%)", marker: { color: "#2471a3" } }],
        { title: { text: "Disposición y viabilidad por segmento", font: { size: 14 } }, barmode: "group" });
    }, 0);
  });

  /* ============================================================ 6. Pronóstico */
  defTab("pronostico", "Pronóstico", function (p) {
    p.append(h("h2", null, "Pronóstico a 12 meses"), h("p", { class: "lead" }, "Consumo y generación por hogar promedio (serie sintética de 2 años). Modelos SARIMAX y Prophet."));
    if (!R.pronostico) { p.append(h("div", { class: "note" }, "No se incluyeron los pronósticos en esta compilación.")); return; }
    const sel = h("select", { onchange: dibujar }, h("option", { value: "Consumo" }, "Consumo"), h("option", { value: "Generación FV" }, "Generación FV"));
    p.append(h("div", { class: "row" }, h("label", { style: "max-width:260px" }, "Serie", sel)), h("div", { class: "card" }, pl("pl-pro", 380)));
    p.append(h("h3", null, "Validación (entrenar 18 meses, evaluar 6)"));
    p.append(h("div", { class: "card" }, tabla(["Serie", "Modelo", "MAE mensual (kWh)", "RMSE (kWh)", "MAPE (%)"], R.pronostico.backtest.map((b) => [b.serie, b.modelo, nf(b.MAE_mensual, 2), nf(b.RMSE_mensual, 2), nf(b["MAPE_%"], 2)]))));
    p.append(h("div", { class: "note" }, "Serie simulada con estacionalidad regular: los errores son optimistas. Con mediciones reales serían mayores."));
    function dibujar() {
      const s = sel.value, H = R.pronostico.historia, F = R.pronostico.futuro[s], y = s === "Consumo" ? H.consumo : H.generacion;
      plot($("#pl-pro"), [{ x: H.mes, y: y, mode: "lines+markers", name: "Histórico", line: { color: TXT } }, { x: F.mes, y: F.SARIMAX, mode: "lines+markers", name: "SARIMAX", line: { color: "#2471a3" } }, { x: F.mes, y: F.Prophet, mode: "lines+markers", name: "Prophet", line: { color: "#c0392b", dash: "dash" } }],
        { title: { text: s + " mensual por hogar (kWh/mes)", font: { size: 14 } }, hovermode: "x unified", height: 380 });
    }
    setTimeout(dibujar, 0);
  });

  /* ============================================================ 7. Subsidios */
  defTab("subsidios", "Subsidios", function (p) {
    p.append(h("h2", null, "Asignación óptima de subsidios"), h("p", { class: "lead" }, "¿Cómo repartir un presupuesto municipal entre los estratos 1, 2 y 3? Optimización entera exacta, calculada en su navegador."));
    const S = {};
    function ctrl(id, lbl, min, max, step, val, f) { const o = h("span", null, f(val)), i = h("input", { type: "range", min: min, max: max, step: step, value: val }); i.addEventListener("input", function () { o.textContent = f(Number(i.value)); programar(); }); S[id] = i; return h("label", null, h("span", null, lbl + ": ", h("b", null, o)), i); }
    const d = R.optimizacion.subsidio_def;
    p.append(h("div", { class: "card" }, h("div", { class: "fields" },
      ctrl("pres", "Presupuesto", 100, 5000, 50, 1000, (v) => "$" + nf(v) + " M COP"), ctrl("eq", "Mínimo del gasto en estrato 1", 0, 90, 5, 0, (v) => v + " %"),
      ctrl("s1", "Subsidio E1", 0, 1, 0.05, d["1"], (v) => nf(100 * v, 0) + " %"), ctrl("s2", "Subsidio E2", 0, 1, 0.05, d["2"], (v) => nf(100 * v, 0) + " %"), ctrl("s3", "Subsidio E3", 0, 1, 0.05, d["3"], (v) => nf(100 * v, 0) + " %"),
      ctrl("we", "Peso energía/CO₂", 0, 1, 0.05, 0.5, (v) => nf(v, 2)), ctrl("wh", "Peso hogares atendidos", 0, 1, 0.05, 0.3, (v) => nf(v, 2)), ctrl("wa", "Peso ahorro familiar", 0, 1, 0.05, 0.2, (v) => nf(v, 2)))));
    const out = h("div", null); p.append(out);
    let t = null; function programar() { clearTimeout(t); t = setTimeout(calcular, 120); }
    const par = () => ({ presupuesto_mm: Number(S.pres.value), sub1: Number(S.s1.value), sub2: Number(S.s2.value), sub3: Number(S.s3.value), min_e1: Number(S.eq.value) / 100, w_en: Number(S.we.value), w_hog: Number(S.wh.value), w_ah: Number(S.wa.value) });
    function calcular() {
      out.textContent = ""; const pr = par(), r = window.Herramientas.optimizar(R.optimizacion, pr);
      if (!r) { out.append(h("div", { class: "note" }, "Sin solución factible con esos parámetros.")); return; }
      const T = r.total;
      out.append(h("div", { class: "grid g4" }, kpi(nf(T.sistemas), "hogares atendidos", "sistemas subsidiados"), kpi(M(T.gasto, 1), "gasto municipal", "de $" + nf(pr.presupuesto_mm) + " M"), kpi(nf(T.co2_t, 0) + " t", "CO₂ evitado", "vida útil, FE " + R.optimizacion.fe_co2 + " kg/kWh"), kpi(M(T.ahorro10, 0), "ahorro familiar a 10 años", "inversión movilizada " + M(T.inversion_total, 0))));
      out.append(h("div", { class: "card" }, tabla(["Estrato", "Subsidio", "Sistemas", "Gasto", "CO₂ (t)", "Ahorro 10 años"], r.filas.map((f) => [f.estrato, f.subsidio_pct + " %", nf(f.sistemas), M(f.gasto, 1), nf(f.co2_t, 0), M(f.ahorro10, 0)]))));
      out.append(h("div", { class: "grid g2" }, h("div", { class: "card" }, pl("pl-opt")), h("div", { class: "card" }, pl("pl-fro"))));
      out.append(h("div", { class: "note" }, "El factor de emisión (0,126 kgCO₂/kWh) es un valor de referencia: la UPME publica factores entre ~0,11 y 0,17 según año y uso. Cambia las cifras de CO₂, no la distribución entre estratos."));
      setTimeout(function () {
        plot($("#pl-opt"), [{ x: r.filas.map((f) => f.estrato), y: r.filas.map((f) => f.sistemas), type: "bar", marker: { color: [1, 2, 3].map((k) => COLOR[k]) }, text: r.filas.map((f) => nf(f.sistemas)), textposition: "outside" }], { title: { text: "Sistemas subsidiados por estrato", font: { size: 14 } } });
        const xs = [], ho = [], co = [];
        for (let m = 0; m <= 90; m += 10) { const q = window.Herramientas.optimizar(R.optimizacion, Object.assign({}, pr, { min_e1: m / 100 })); if (q) { xs.push(m); ho.push(q.total.sistemas); co.push(q.total.co2_t); } }
        plot($("#pl-fro"), [{ x: xs, y: co, mode: "lines+markers", name: "CO₂ evitado (t)" }, { x: xs, y: ho, mode: "lines+markers", name: "Hogares", yaxis: "y2" }], { title: { text: "Frontera eficiencia-equidad", font: { size: 14 } }, xaxis: { title: "Mínimo del gasto en estrato 1 (%)" }, yaxis: { title: "tCO₂" }, yaxis2: { overlaying: "y", side: "right", title: "Hogares" } });
      }, 0);
    }
    calcular();
  });

  /* ============================================================ 8. Economía circular */
  defTab("raee", "Economía circular", function (p) {
    p.append(h("h2", null, "Residuos fotovoltaicos (RAEE)"), h("p", { class: "lead" }, "Fin de vida de los paneles e inversores de un programa de instalaciones 2026-2030, proyectado hasta 2065."));
    const S = {};
    function ctrl(id, lbl, min, max, step, val, f) { const o = h("span", null, f(val)), i = h("input", { type: "range", min: min, max: max, step: step, value: val }); i.addEventListener("input", function () { o.textContent = f(Number(i.value)); programar(); }); S[id] = i; return h("label", null, h("span", null, lbl + ": ", h("b", null, o)), i); }
    const modo = h("select", { onchange: function () { programar(); } }, window.Herramientas.MODOS.map((m, i) => h("option", { value: i }, m))); S.modo = modo;
    const pot = h("select", { onchange: function () { programar(); } }, [400, 430, 450, 500, 525, 550].map((v) => h("option", { value: v, selected: v === 450 ? "selected" : null }, v + " W"))); S.pot = pot;
    p.append(h("div", { class: "card" }, h("div", { class: "fields" }, ctrl("sis", "Sistemas instalados", 500, 50000, 500, 5000, (v) => nf(v)), ctrl("pan", "Paneles por sistema", 3, 12, 1, 3, (v) => v), h("label", null, "Potencia del panel", pot),
      h("label", null, "Modelo de fin de vida", modo), ctrl("vid", "Vida útil (retiro programado)", 20, 30, 1, 25, (v) => v + " años"), ctrl("rec", "Eficiencia de recuperación", 50, 120, 5, 100, (v) => v + " %"))));
    const out = h("div", null); p.append(out);
    let t = null; function programar() { clearTimeout(t); t = setTimeout(calcular, 120); }
    function calcular() {
      out.textContent = "";
      const r = window.Herramientas.raee({ sistemas: Number(S.sis.value), potencia_w: Number(S.pot.value), paneles_por_sistema: Number(S.pan.value), modo: Number(S.modo.value), vida: Number(S.vid.value), recuperacion: Number(S.rec.value) / 100 });
      out.append(h("div", { class: "grid g4" }, kpi(nf(r.total_t, 1) + " t", "RAEE hasta 2065", "paneles " + nf(r.paneles_t, 0) + " t · inversores " + nf(r.inversores_t, 0) + " t"), kpi(r.pico.anio, "año pico", nf(r.pico.residuo_total_t, 1) + " t en ese año"),
        kpi(nf(r.recuperable_t, 1) + " t", "materiales recuperables", pc(r.recuperable_t / Math.max(r.total_t, 1e-9), 0) + " del RAEE", "ok"), kpi(nf(r.masa_panel_kg, 1) + " kg", "masa por panel", "≈ 0,052 kg/W")));
      out.append(h("div", { class: "card" }, pl("pl-raee", 360)));
      out.append(h("div", { class: "card" }, tabla(["Material", "Recuperable (t)"], Object.keys(r.materiales).map((k) => [k, nf(r.materiales[k], 1)])), h("p", { class: "lead" }, "Composición y tasas de recuperación supuestas (ilustrativas): verificar con literatura técnica y operadores de reciclaje; Ley 1672 de 2013.")));
      setTimeout(function () {
        const f = r.filas.filter((x) => x.residuo_total_t > 0.0005);
        plot($("#pl-raee"), [{ x: f.map((x) => x.anio), y: f.map((x) => x.recuperable_t), type: "bar", name: "Recuperable (t)", marker: { color: "#1e8449" } }, { x: f.map((x) => x.anio), y: f.map((x) => x.disposicion_t), type: "bar", name: "A valorización/disposición (t)", marker: { color: "#c0392b" } }],
          { title: { text: "RAEE por año (t)", font: { size: 14 } }, barmode: "stack", height: 360 });
      }, 0);
    }
    calcular();
  });

  /* ============================================================ 9. Acerca de */
  defTab("acerca", "Acerca de", function (p) {
    const ej = JSON.stringify({ estrato: 2, zona: "Urbana", num_personas: 3, num_menores: 1, num_adultos_mayores: 0, ingreso_mensual_cop: 1650000, consumo_kwh_mes: 135, tarifa_kwh_cop: 810, area_vivienda_m2: 80, area_cubierta_m2: 60, inclinacion_cubierta_grados: 25,
      orientacion_cubierta: "Norte", tipo_cubierta: "Teja de barro", sombras_presentes: "No", num_paneles_estimados: 4, potencia_panel_w: 450, ratio_diurno_pct: 52, nivel_educativo: "Técnico", ocupacion_principal: "Empleado", tiene_empresa: "No",
      tiene_internet: "Sí", tiene_smartphone: "Sí", tiene_medidor_inteligente: "No", recibe_subsidio: "Sí", conoce_reciclaje_paneles: "No", interes_comunidad_energetica: "No" });
    p.append(h("h2", null, "Acerca de este tablero"));
    p.append(h("div", { class: "card" }, h("h3", null, "Modelo"), h("p", null, "SolarNet-MT es una red neuronal multitarea entrenada con Keras. Tiene una rama técnica (consumo, tarifa, cubierta, sistema) que predice el impacto económico, una rama social (ingreso, educación, acceso digital) y una cabeza de adopción que recibe ambas más las predicciones económicas. Se entrena como ensamble de 5 redes; la desviación entre ellas mide la incertidumbre. La inferencia se hace en JavaScript puro, con los pesos exportados, y reproduce la salida de Keras con diferencias menores de 0,00001."),
      h("p", null, "Se compararon tres arquitecturas con validación cruzada (perceptrón 64-32, perceptrón profundo 128-64-32 y SolarNet-MT) y se mantuvieron dos líneas base clásicas únicamente como referencia.")));
    p.append(h("div", { class: "note" }, h("b", null, "Datos y límites. "), "Los datos son sintéticos y la decisión de adoptar incluye un componente aleatorio generado a propósito (ruido de decisión 0,45 en la versión 2 del conjunto; 0,8 en la versión 1). Cualquier exactitud es válida solo frente a ese generador. Con datos reales deben reentrenarse, recalibrarse y auditarse los modelos (equidad por estrato y zona), y no deben usarse para excluir hogares de programas de apoyo."));
    p.append(h("div", { class: "card" }, h("h3", null, "API REST"), h("p", null, "El mismo modelo está disponible como función serverless: ", h("code", null, "POST /api/predict"), " con las 26 variables del simulador."),
      h("pre", null, "curl -X POST " + location.origin + "/api/predict \\\n  -H \"Content-Type: application/json\" \\\n  -d '" + ej + "'")));
    p.append(h("div", { class: "card" }, h("h3", null, "Reproducir el entrenamiento"), h("p", null, "El script entrenar_red_neuronal.py (o el cuaderno de Colab incluido) entrena la red con dataset_solar_popayan.csv y regenera los archivos public/model/solarnet.json y public/data/*.json que usa este sitio.")));
  });

  /* ============================================================ arranque */
  function activar(id) {
    PANELS.forEach((t) => { const on = t.id === id; t.btn.setAttribute("aria-selected", on); t.sec.classList.toggle("on", on); if (on && !t.hecho) { t.hecho = true; try { t.render(t.sec); } catch (e) { t.sec.append(h("div", { class: "note" }, "Error al mostrar esta sección: " + e.message)); console.error(e); } } });
    if (window.Plotly) setTimeout(function () { document.querySelectorAll(".panel.on .plot").forEach((e) => { try { window.Plotly.Plots.resize(e); } catch (x) {} }); }, 50);
    history.replaceState(null, "", "#" + id);
  }
  function iniciar() {
    const app = $("#app"), nav = $("#tabs"); app.textContent = "";
    PANELS.forEach((t) => {
      t.btn = h("button", { role: "tab", "aria-selected": "false", onclick: function () { activar(t.id); } }, t.titulo); nav.append(t.btn);
      t.sec = h("section", { class: "panel", id: "tab-" + t.id, role: "tabpanel" }); app.append(t.sec);
    });
    const ini = (location.hash || "").slice(1); activar(PANELS.some((t) => t.id === ini) ? ini : "resumen");
  }
  Promise.all(["data/resumen.json", "data/nn_resultados.json", "model/solarnet.json"].map((u) => fetch(u).then((r) => { if (!r.ok) throw new Error(u + " (" + r.status + ")"); return r.json(); })))
    .then((a) => { R = a[0]; N = a[1]; MODEL = a[2]; iniciar(); })
    .catch((e) => { $("#app").textContent = "No se pudieron cargar los datos del modelo: " + e.message; console.error(e); });
})();
