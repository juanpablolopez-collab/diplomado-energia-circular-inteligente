"""Genera las figuras del artículo IEEE a partir del dataset y del tablero web.

Ejecutar desde cualquier directorio:
    python documento/ieee/generar_figuras.py
"""
import json
import os
import sys

import matplotlib
matplotlib.use("Pdf")
import matplotlib.pyplot as plt
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
FIGDIR = os.path.join(HERE, "figuras")
os.makedirs(FIGDIR, exist_ok=True)

plt.rcParams.update({"font.size": 9, "axes.grid": True, "grid.alpha": 0.3, "figure.dpi": 200})

df = pd.read_csv(os.path.join(ROOT, "datos", "solar_popayan", "dataset_solar_popayan.csv"), encoding="utf-8")

consumo = df.groupby("estrato")["consumo_kwh_mes"].mean()
fig, ax = plt.subplots(figsize=(6.6, 3.0))
ax.bar(consumo.index.astype(str), consumo.values, color="#2b7bba")
ax.set(xlabel="Estrato", ylabel="Consumo medio (kWh/mes)", title="Consumo eléctrico por estrato (n=1.000)")
for i, v in enumerate(consumo.values):
    ax.text(i, v + 2, f"{v:.1f}", ha="center", fontsize=8)
fig.tight_layout()
fig.savefig(os.path.join(FIGDIR, "consumo_estrato.pdf"), bbox_inches="tight")
plt.close(fig)

target = df["dispuesto_instalar_paneles"].value_counts().reindex(["Sí", "Tal vez", "No"])
fig, ax = plt.subplots(figsize=(6.6, 3.0))
ax.bar(target.index, target.values, color=["#2e8b57", "#d9a441", "#b0453b"])
ax.set(ylabel="Hogares", title="Disposición a instalar paneles solares")
for i, v in enumerate(target.values):
    ax.text(i, v + 8, str(int(v)), ha="center", fontsize=8)
fig.tight_layout()
fig.savefig(os.path.join(FIGDIR, "disposicion_paneles.pdf"), bbox_inches="tight")
plt.close(fig)

res_path = os.path.join(ROOT, "modulos", "07-proyecto-integrador", "sitio-web", "data", "resumen.json")
with open(res_path, encoding="utf-8") as fh:
    res = json.load(fh)
x = [str(e["estrato"]) for e in res["estratos"]]
y = [e["retorno"] for e in res["estratos"]]
fig, ax = plt.subplots(figsize=(6.6, 3.0))
ax.bar(x, y, color="#7a4fa3")
ax.set(xlabel="Estrato", ylabel="Retorno simple (años)", title="Retorno simple de la inversión por estrato")
for i, v in enumerate(y):
    ax.text(i, v + 0.15, f"{v:.1f}", ha="center", fontsize=8)
fig.tight_layout()
fig.savefig(os.path.join(FIGDIR, "retorno_estrato.pdf"), bbox_inches="tight")
plt.close(fig)

print("Figuras generadas en:", FIGDIR)
