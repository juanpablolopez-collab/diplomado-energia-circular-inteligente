import os, csv, zipfile, hashlib, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(HERE, "apendices.tex")
ZIP = os.path.join(ROOT, "entregables", "resultados_proyecto_solar_popayan.zip")
FIGDIR = os.path.join(HERE, "figuras_gradio")

def esc(s):
    s = str(s)
    rep = [("\\", "\\textbackslash{}"), ("&", "\\&"), ("%", "\\%"), ("$", "\\$"),
           ("#", "\\#"), ("_", "\\_"), ("{", "\\{"), ("}", "\\}"),
           ("~", "\\textasciitilde{}"), ("^", "\\textasciicircum{}")]
    for a, b in rep:
        s = s.replace(a, b)
    return s

def caption(name):
    rules = [
        ("clf_", "Clasificador: "), ("reg_", "Regresión: "), ("eda_", "EDA: "),
        ("ts_", "Series temporales: "), ("opt_", "Optimización: "), ("raee_", "RAEE: "),
        ("kmeans_", "K-means: "), ("dbscan_", "DBSCAN: "), ("nn_", "Red neuronal: "),
        ("pca_", "PCA: "), ("tsne_", "t-SNE: "), ("analisis_", "Análisis: "),
        ("matriz_", "Matriz: "), ("dendrograma_", "Dendrograma: "),
        ("pareto_", "Pareto: "), ("fairness_", "Equidad: "), ("serie_", "Serie: "),
    ]
    base = name
    for k, v in rules:
        if name.startswith(k):
            base = v + name[len(k):]
            break
    return esc(base.replace("_", " ").capitalize())

L = []
w = L.append

w("% Apéndices generados automáticamente desde el ZIP de resultados.")
w("\\appendices")
w("\\section{Matriz normativa completa}")
w("La Tabla~\\ref{tab:matriz completa} reproduce la matriz normativa ampliada del documento original, con los artículos clave, el contenido principal, la relación con el problema, la aplicación territorial y las implicaciones para el proyecto.")
w("\\begin{table}[p]")
w("\\caption{Matriz normativa ampliada}")
w("\\label{tab:matriz completa}")
w("\\centering\\scriptsize")
w("\\begin{tabular}{@{}p{0.10\\columnwidth}p{0.06\\columnwidth}p{0.13\\columnwidth}p{0.20\\columnwidth}p{0.17\\columnwidth}p{0.15\\columnwidth}p{0.16\\columnwidth}@{}}")
w("\\toprule")
w("Norma & Año & Artículos & Contenido & Relación & Aplicación & Implicaciones \\\\")
w("\\midrule")
matriz = [
 ("Ley 697","2001","1,2,3,5,6,9,10","Declara el URE de interés social; crea PROURE; define FNCER","Marco general de eficiencia y energías alternativas","Nacional; Popayán debe incorporar el URE","Fundamenta eficiencia y FNCER en hogares"),
 ("Ley 142","1994","1,2,87.9,99,126","Régimen de servicios públicos domiciliarios; subsidios","Marco de prestación del servicio eléctrico","Nacional; cumplimiento del régimen en Popayán","Relación autogeneración--servicio público"),
 ("Ley 143","1994","1,11,21,37,54","Régimen de la industria eléctrica; CREG","Marco de operación del mercado","Nacional; cumplimiento de la CREG","Integración de la autogeneración al mercado"),
 ("Ley 1581","2012","1,2,3,4","Protección general de datos personales","Marco para datos en sistemas de IA","Nacional; protección de datos en Popayán","Consideraciones éticas y legales de la IA"),
 ("Ley 1672","2013","Título I","Política pública de gestión integral de RAEE","Gestión de residuos de paneles y baterías","Nacional; aplicable a Popayán","Cierra el ciclo de vida del sistema"),
 ("Ley 1715","2014","1,4,5,8,10--14,21,22,30,33,34","Integración de FNCER; incentivos; FENOGE; medición bidireccional","Marco legal de la autogeneración residencial","Nacional; hogares acceden a incentivos","Viabilidad normativa y financiación"),
 ("Ley 1955","2019","174,175,296","PND 2018--2022; incentivos FNCER; auditorías","Antecedente de política pública","Nacional; auditorías energéticas","Continuidad de las políticas"),
 ("Ley 2099","2021","2,3,5,7--11,13,20,21,25--27,29,33,41,43,48,49,55","Moderniza Ley 1715; hidrógeno; comunidades; FONENERGIA","Marco actualizado de transición","Nacional; acceso a FENOGE y FONENERGIA","Marco vigente del proyecto"),
 ("Ley 2169","2021","1,33","Metas de carbono neutralidad y resiliencia","Reducción de GEI","Nacional; metas climáticas","Aporte a mitigación climática"),
 ("Ley 2294","2023","223,235,237,247--249,253,264,267,272,298,313","PND 2022--2026; transición justa; comunidades; FOES","Marco de política y comunidades","Nacional; alineación del PND","Articulación con política nacional"),
 ("Decreto 2236","2023","2.2.9.1.1--2.2.9.1.15","Reglamenta comunidades energéticas; AGRC y GDC","Marco reglamentario de comunidades","Nacional; conformación en Popayán","Viabilidad de gestión comunitaria"),
 ("Decreto 273","2024","Único","Corrige un yerro del Decreto 2236","Ajuste reglamentario","Nacional","Seguridad jurídica del marco"),
 ("CONPES 4075","2022","Ejes y 97 acciones","Política de Transición Energética; 4 ejes","Marco de política energética","Nacional; alineación municipal","Pertinencia del proyecto"),
 ("CONPES 4144","2025","Ejes y 106 acciones","Política Nacional de IA; 6 ejes","Marco de política de IA","Nacional; alineación municipal","Integración de IA en fotovoltaica"),
]
for row in matriz:
    w(" & ".join(esc(x) for x in row) + " \\\\")
w("\\bottomrule")
w("\\end{tabular}")
w("\\end{table}")

w("\\section{Inventario de modelos y metadatos}")
w("\\subsection{Metadatos del experimento}")
with zipfile.ZipFile(ZIP) as z:
    meta = z.read("metadatos.json").decode("utf-8")
w("El archivo \\texttt{metadatos.json} contiene la semilla, las clases, las listas de variables de clasificación, regresión y perfil horario. Su contenido íntegro se reproduce a continuación:")
w("\\begin{lstlisting}[caption={Metadatos completos del experimento},basicstyle=\\tiny\\ttfamily]")
w(meta)
w("\\end{lstlisting}")
w("\\subsection{Modelos entrenados}")
w("La Tabla~\\ref{tab:modelos} relaciona los 17 modelos del paquete con su tamaño y huella digital SHA-256, para garantizar trazabilidad.")
w("\\begin{table}[p]")
w("\\caption{Modelos incluidos en el paquete de resultados}")
w("\\label{tab:modelos}")
w("\\centering\\scriptsize")
w("\\begin{tabular}{@{}lll@{}}")
w("\\toprule")
w("Archivo & Tamaño (KB) & SHA-256 (16 primeros) \\\\")
w("\\midrule")
with zipfile.ZipFile(ZIP) as z:
    for i in sorted([i for i in z.infolist() if i.filename.startswith("modelos/")], key=lambda x: x.filename):
        h = hashlib.sha256(z.read(i.filename)).hexdigest()[:16]
        w("%s & %.1f & \\texttt{%s} \\\\" % (esc(i.filename.split("/")[-1]), i.file_size/1024, h))
w("\\bottomrule")
w("\\end{tabular}")
w("\\end{table}")

w("\\section{Tablas de resultados}")
w("Esta sección reproduce las 38 tablas CSV del paquete. Las tablas con más de nueve columnas se presentan en formato vertical para evitar desbordamientos; en ambos casos el archivo original permanece disponible en \\texttt{entregables/}.")
with zipfile.ZipFile(ZIP) as z:
    files = sorted([i for i in z.infolist() if i.filename.startswith("tablas/")], key=lambda x: x.filename)
for info in files:
    name = info.filename.split("/")[-1]
    import io
    with zipfile.ZipFile(ZIP) as z:
        text = z.read(info.filename).decode("utf-8-sig", errors="replace")
    rows = list(csv.reader(io.StringIO(text)))
    if not rows:
        continue
    hdr, body = rows[0], rows[1:]
    w("\\subsection*{%s}" % esc(name))
    truncated = len(body) > 40
    if truncated:
        body = body[:40]
        w("{\\footnotesize Primeras 40 filas de %d; archivo completo en \\texttt{entregables/}.}" % len(rows) + "\\\\")
    if len(hdr) <= 9:
        widths = []
        for j in range(len(hdr)):
            mx = max([len(hdr[j])] + [len(r[j]) for r in body if j < len(r)] or [0])
            widths.append("p{0.20\\columnwidth}" if mx > 22 else "l")
        w("{\\footnotesize\\begin{longtable}{@{}%s@{}}" % "".join(widths))
        w("\\toprule")
        w(" & ".join(esc(x) for x in hdr) + " \\\\")
        w("\\midrule\\endhead")
        for r in body:
            vals = [r[j] if j < len(r) else "" for j in range(len(hdr))]
            w(" & ".join(esc(v) for v in vals) + " \\\\")
        w("\\bottomrule")
        w("\\end{longtable}}")
    else:
        for k, r in enumerate(body, 1):
            parts = []
            for j, h in enumerate(hdr):
                v = r[j] if j < len(r) else ""
                if v:
                    parts.append("%s: %s" % (esc(h), esc(v)))
            w("{\\footnotesize\\textbf{Fila %d:} %s\\par}" % (k, "; ".join(parts)))

w("\\section{Galería de gráficas del despliegue Gradio}")
w("Las 52 figuras siguientes son las gráficas interactivas generadas por la aplicación Gradio, exportadas desde sus definiciones Plotly y convertidas a PDF vectorial. Se muestran íntegramente, sin omitir ninguna.")
figdir = FIGDIR
for idx, f in enumerate(sorted(os.listdir(figdir)), 1):
    if not f.endswith(".pdf"):
        continue
    name = os.path.splitext(f)[0]
    w("{\\par\\centering\\includegraphics[width=\\columnwidth]{figuras_gradio/%s}\\par}" % name)
    w("{\\par\\centering\\small\\textbf{Figura~G.%d:} %s.\\par\\vspace{0.8em}}" % (idx, caption(name)))

w("\\section{Anexos del documento original}")
w("\\subsection{Anexo D: encuesta propuesta}")
preguntas = [
 "¿Cuántas personas habitan en su hogar?",
 "¿Cuál es el estrato socioeconómico de su vivienda?",
 "¿Cuál es el valor promedio mensual de su factura de energía?",
 "¿Ha considerado instalar paneles solares en su hogar?",
 "¿Conoce los incentivos de la Ley 1715 de 2014?",
 "¿Estaría dispuesto a participar en una comunidad energética?",
 "¿Cuenta con conexión a Internet en su hogar?",
 "¿Qué barreras identifica para instalar paneles solares?",
]
for i, p in enumerate(preguntas, 1):
    w("\\item %s" % esc(p))
w("\\subsection{Anexo E: glosario}")
glosario = [
 ("AGRC","Autogeneración Colectiva"),("CREG","Comisión de Regulación de Energía y Gas"),
 ("DANE","Departamento Administrativo Nacional de Estadística"),("DER","Recursos Energéticos Distribuidos"),
 ("FENOGE","Fondo de Energías No Convencionales y Gestión Eficiente de la Energía"),
 ("FNCER","Fuentes No Convencionales de Energía Renovable"),("FONENERGIA","Fondo Único de Soluciones Energéticas"),
 ("GDC","Generación Distribuida Colectiva"),("GEI","Gases de Efecto Invernadero"),
 ("IA","Inteligencia Artificial"),("IDEAM","Instituto de Hidrología, Meteorología y Estudios Ambientales"),
 ("IPSE","Instituto de Planificación y Promoción de Soluciones Energéticas"),
 ("MME","Ministerio de Minas y Energía"),("NBI","Necesidades Básicas Insatisfechas"),
 ("ODS","Objetivos de Desarrollo Sostenible"),("PND","Plan Nacional de Desarrollo"),
 ("PROURE","Programa de Uso Racional y Eficiente de la Energía"),
 ("RAEE","Residuos de Aparatos Eléctricos y Electrónicos"),
 ("UPME","Unidad de Planeación Minero-Energética"),("URE","Uso Racional y Eficiente de la Energía"),
]
for a, b in glosario:
    w("\\item[%s] %s" % (esc(a), esc(b)))
w("\\subsection{Anexo F: lista de verificación de coherencia}")
checks = [
 "¿Se citan todas las normas suministradas en los PDF?",
 "¿Se identifican los artículos clave de cada norma?",
 "¿Se analizan las tensiones y derogatorias entre normas?",
 "¿Se evidencia el potencial solar de Popayán?",
 "¿Se caracteriza socioeconómicamente el territorio?",
 "¿Se identifican los actores relevantes?",
 "¿Se describen las brechas y necesidades?",
 "¿Se articula el mapa territorial con la matriz normativa?",
 "¿Se formula una pregunta orientadora clara y delimitada?",
 "¿Se justifica social, económica, ambiental y normativamente el proyecto?",
 "¿Se delimita temporal, espacial, conceptual y poblacionalmente el problema?",
 "¿Se proponen objetivos general y específicos coherentes?",
 "¿Se describe la metodología mixta?",
 "¿Se identifican los impactos y resultados esperados?",
 "¿Se incluyen indicadores de seguimiento?",
 "¿Se respeta el enfoque diferencial e interseccional?",
 "¿Se integra la IA y la economía circular?",
 "¿Se articula con los ODS y las NDC?",
 "¿Se usan citas en APA 7?",
 "¿Se incluyen anexos y glosario?",
]
for c in checks:
    w("\\item %s" % esc(c))

w("\\section{Código fuente y reproducibilidad}")
w("El código completo se conserva en el repositorio. La Tabla~\\ref{tab:codigo} enumera los archivos ejecutables; el Listado~\\ref{lst:pipeline} contiene íntegramente el pipeline Python.")
w("\\begin{table}[p]")
w("\\caption{Archivos de código fuente}")
w("\\label{tab:codigo}")
w("\\centering\\footnotesize")
w("\\begin{tabular}{@{}lr@{}}")
w("\\toprule")
w("Archivo & Líneas \\\\")
w("\\midrule")
codefiles = [
 ("modulos/07-proyecto-integrador/notebooks/proyecto.ipynb", "4 celdas (432, 1878, 103, 15 líneas)"),
 ("modulos/07-proyecto-integrador/export_colab/proyecto.py", "2441"),
 ("modulos/07-proyecto-integrador/sitio-web/js/app.js", "986"),
 ("modulos/07-proyecto-integrador/sitio-web/js/solarnet.js", "160"),
 ("modulos/07-proyecto-integrador/sitio-web/js/herramientas.js", "150"),
 ("documento/ieee/generar_figuras.py", "56"),
]
for a, b in codefiles:
    w("%s & %s \\\\" % (esc(a), esc(b)))
w("\\bottomrule")
w("\\end{tabular}")
w("\\end{table}")
w("\\begin{verbatim}")
w("\\end{verbatim}")
w("A continuación se reproducen íntegramente los archivos ejecutables del proyecto.")
for ruta, tit in [
    ("modulos/07-proyecto-integrador/export_colab/proyecto.py", "Pipeline completo (proyecto.py)"),
    ("modulos/07-proyecto-integrador/sitio-web/js/app.js", "Controlador web (app.js)"),
    ("modulos/07-proyecto-integrador/sitio-web/js/solarnet.js", "Red neuronal JavaScript (solarnet.js)"),
    ("modulos/07-proyecto-integrador/sitio-web/js/herramientas.js", "Utilidades (herramientas.js)"),
]:
    rel = os.path.relpath(os.path.join(ROOT, ruta), HERE).replace("\\", "/")
    lbl = ",label={lst:pipeline}" if ruta.endswith("proyecto.py") else ""
    w("\\lstinputlisting[caption={%s}%s]{%s}" % (tit, lbl, rel))
w("Las instrucciones de ejecución están en \\texttt{documento/ieee/README.md}.")

open(OUT, "w", encoding="utf-8").write("\n".join(L) + "\n")
print("escrito", OUT, "| lineas:", len(L))
