# Artículo IEEE -- edición exhaustiva

Versión completa en formato IEEE del proyecto integrador *Autogeneración solar fotovoltaica en hogares de Popayán*, construida a partir del [`DIPLOMADO.pdf`](../DIPLOMADO.pdf) y de **toda** la evidencia descargada al repositorio. El PDF resultante tiene **59 páginas** y se compila sin advertencias.

## Archivos

| Archivo | Descripción |
| --- | --- |
| `main.tex` | Fuente principal (`IEEEtran`, dos columnas, español) |
| `apendices.tex` | Apéndices generados (matriz normativa, modelos, 38 tablas, 52 gráficas, anexos y código) |
| `guias_metodologicas.tex` | Apéndice con las guías y ejemplos de los profesores |
| [`autogeneracion-solar-fotovoltaica-en-hogares-de-popayan.pdf`](../../modulos/07-proyecto-integrador/autogeneracion-solar-fotovoltaica-en-hogares-de-popayan.pdf) | PDF compilado (59 páginas), disponible en el módulo 7 |
| `figuras/` | 3 figuras propias generadas desde el dataset y el tablero web |
| `figuras_gradio/` | **52 gráficas PDF** convertidas desde los HTML Plotly del ZIP de Gradio |
| `generar_figuras.py` | Genera las 3 figuras propias |
| `convertir_graficas.py` | Convierte las 52 gráficas Plotly del ZIP a PDF |
| `generar_apendices.py` | Regenera `apendices.tex` desde el ZIP y el código del repo |

## Contenido incluido (sin omisiones)

1. **Formulación original completa**: resumen, introducción, mapa territorial (13 subsecciones), matriz normativa, análisis normativo integrador, planteamiento del problema, justificación en siete dimensiones, delimitación, hipótesis, viabilidad, ODS/NDC, objetivos, marcos referencial e institucional, metodología, resultados esperados, impactos e indicadores, conclusiones y agenda futura.
2. **Matriz normativa ampliada** con 14 normas y sus seis columnas originales (artículos clave, contenido, relación, aplicación e implicaciones).
3. **Evidencia computacional**: dataset de 1.000 hogares y 99 variables, métricas de los modelos, red neuronal multimodal y resultados del despliegue Gradio.
4. **Galería de 52 gráficas** del despliegue Gradio, exportadas desde sus definiciones Plotly y convertidas a PDF vectorial.
5. **38 tablas CSV** del paquete de resultados, reproducidas íntegramente (las de más de nueve columnas en formato vertical; las extensas se truncan a 40 filas con aviso, conservándose el archivo completo en `entregables/`).
6. **17 modelos** con tamaño y SHA-256, y los metadatos completos del experimento (semilla, clases y listas de variables).
7. **Anexos A--F** del documento original: encuesta propuesta, glosario, siglas, árbol de problemas y lista de verificación de coherencia.
8. **Código fuente íntegro** como listados: `proyecto.py` (2.441 líneas), `app.js`, `solarnet.js` y `herramientas.js`.
9. **Referencias** en estilo IEEE (18 entradas) y enlaces a los despliegues.

Se advierte explícitamente que las cifras del tablero web y de la app Gradio provienen de datasets distintos y no son directamente comparables.

## Compilación

Requiere MiKTeX:

```powershell
cd documento/ieee
$pdflatex = "$env:LOCALAPPDATA\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe"
& $pdflatex -interaction=nonstopmode main.tex
& $pdflatex -interaction=nonstopmode main.tex
```

Para regenerar figuras y apéndices:

```powershell
python -m pip install pandas matplotlib "plotly==5.24.1" "kaleido==0.2.1"
python generar_figuras.py
python convertir_graficas.py
python generar_apendices.py
```

## Estilo

`IEEEtran` con bibliografía numérica en `thebibliography`, `longtable` para las tablas extendidas y `listings` para el código. Los archivos auxiliares de LaTeX se ignoran mediante `.gitignore`; el PDF, las figuras y los scripts se versionan.
