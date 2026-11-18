"""Convierte las 52 gráficas Plotly del ZIP de resultados a PDF vectorial.

Uso: python documento/ieee/convertir_graficas.py
Requiere: plotly==5.24.1, kaleido==0.2.1
"""
import json
import os
import zipfile

import plotly.graph_objects as go

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
ZIP = os.path.join(ROOT, "entregables", "resultados_proyecto_solar_popayan.zip")
OUT = os.path.join(HERE, "figuras_gradio")
TMP = os.path.join(HERE, "_graficas_html")
os.makedirs(OUT, exist_ok=True)


def extraer_args(s, inicio):
    args, prof, cadena, esc, actual = [], 0, False, False, []
    for ch in s[inicio:]:
        if cadena:
            actual.append(ch)
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                cadena = False
            continue
        if ch == '"':
            cadena = True
            actual.append(ch)
        elif ch in "[{":
            prof += 1
            actual.append(ch)
        elif ch in "]}":
            prof -= 1
            actual.append(ch)
        elif ch == "," and prof == 0:
            args.append("".join(actual).strip())
            actual = []
        elif ch == ")":
            if actual:
                args.append("".join(actual).strip())
            return args
        else:
            actual.append(ch)
    return args


with zipfile.ZipFile(ZIP) as z:
    for info in z.infolist():
        if info.filename.startswith("graficos/") and info.filename.endswith(".html"):
            z.extract(info, TMP)

converted = 0
for nombre in sorted(os.listdir(os.path.join(TMP, "graficos"))):
    if not nombre.endswith(".html"):
        continue
    ruta = os.path.join(TMP, "graficos", nombre)
    s = open(ruta, encoding="utf-8").read()
    inicio = s.index("Plotly.newPlot(") + len("Plotly.newPlot(")
    args = extraer_args(s, inicio)
    data = json.loads(args[1])
    layout = json.loads(args[2])
    layout.pop("template", None)
    altura = min(int(layout.get("height", 550)), 900)
    fig = go.Figure(data=data, layout=layout)
    fig.write_image(os.path.join(OUT, nombre[:-5] + ".pdf"), format="pdf", width=1200, height=altura)
    converted += 1

print("Gráficas convertidas:", converted, "->", OUT)
