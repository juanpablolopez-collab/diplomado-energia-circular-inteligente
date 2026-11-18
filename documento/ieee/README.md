# Artículo en formato IEEE

Versión IEEE del proyecto integrador *Autogeneración solar fotovoltaica en hogares de Popayán*, elaborada a partir del [`DIPLOMADO.pdf`](../DIPLOMADO.pdf) y de toda la evidencia descargada al repositorio.

## Archivos

| Archivo | Descripción |
| --- | --- |
| `main.tex` | Fuente LaTeX (`IEEEtran`, dos columnas, español) |
| `main.pdf` | PDF compilado (4 páginas) |
| `figuras/` | Tres figuras PDF generadas desde el dataset y el tablero web |

## Contenido integrado

- **Formulación original** del PDF: mapa territorial argumentado, matriz normativa, árbol de problemas, pregunta orientadora, objetivos, marco referencial, metodología, resultados e indicadores.
- **Normativa completa**: 14 disposiciones con sus PDF en [`normativa/`](../../normativa/README.md).
- **Evidencia computacional**: dataset de 1.000 hogares y 99 variables, métricas del modelo, red neuronal multimodal y resultados del despliegue Gradio.
- **Tablero web**: cifras de consumo, retorno por estrato y equidad de subsidios tomadas de [`sitio-web/`](../../modulos/07-proyecto-integrador/sitio-web/README.md).
- **Entregables**: inventario del ZIP con 108 archivos en [`entregables/`](../../entregables/INVENTARIO.md).
- **Apéndices**: inventario documental del repositorio e instrucciones de reproducibilidad.

Una advertencia explícita en la Sección VIII señala que las cifras del tablero web y de la app Gradio provienen de datasets distintos y no son directamente comparables.

## Compilación

Requiere MiKTeX (instalado en este entorno):

```powershell
cd documento/ieee
& "$env:LOCALAPPDATA\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe" -interaction=nonstopmode main.tex
& "$env:LOCALAPPDATA\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe" -interaction=nonstopmode main.tex
```

Para regenerar las figuras:

```powershell
python -m pip install pandas matplotlib
python generar_figuras.py
```

## Estilo

Se usa `IEEEtran` con bibliografía numérica en `thebibliography`. Los archivos auxiliares (`.aux`, `.log`, `.out`) se ignoran mediante `.gitignore`; el PDF y las figuras sí se versionan.
