# Módulo 7 — Proyecto integrador

**Autogeneración Solar Fotovoltaica en Hogares de Popayán, Cauca (2026-2030)**

| Campo | Valor |
| --- | --- |
| Distribución | 0 teóricas + 20 prácticas = 20 h |
| Peso en la evaluación | 25 % |
| Equipos | 3 a 5 participantes |

**Propósito.** Resolver una necesidad energética y circular mediante una solución que combine diagnóstico, medición, análisis, IA local, prototipado, comunicación y viabilidad.

La versión correcta del proyecto (que reemplaza los notebooks enviados anteriormente) está basada en el dataset [`datos/solar_popayan/`](../../datos/solar_popayan/README.md).

**Casos admisibles:** pequeña planta agroindustrial (café, alimentos, lácteos, empaques); hotel, restaurante, transporte, comercio o centro logístico; institución educativa, laboratorio o dependencia pública; acueducto comunitario, bombeo, finca tecnificada o centro de acopio; constructora, taller o emprendimiento de aprovechamiento; comunidad energética en etapa conceptual o sistema fotovoltaico con necesidades de operación.

**Criterio de autenticidad.** La evaluación no premia la cantidad de herramientas, sino la coherencia entre problema, datos, cálculo, decisión, prototipo y evidencia. Los productos generados con IA conservan archivos fuente, versiones, parámetros esenciales y validación humana.

**Requisitos de opción de grado.** Aprobación previa del tema, memoria técnica, repositorio organizado, evidencia de aporte individual, informe de originalidad y declaración de uso de IA, sustentación ante jurados y producto transferible.

## Archivos

| Archivo | Qué es |
| --- | --- |
| [`notebooks/proyecto.ipynb`](notebooks/proyecto.ipynb) | Notebook correcto (4 celdas): 1) genera o carga el dataset, 2) pipeline completo (~1.770 líneas), 3) despliegue de Gradio con ngrok, 4) notas de limitaciones |
| [`export_colab/proyecto.py`](export_colab/proyecto.py) | Exportación de Colab del notebook anterior (2.441 líneas). Compila como Python; los imports de `google.colab` están protegidos para que funcione fuera de Colab |
| [`sitio-web/`](sitio-web/README.md) | Copia del dashboard desplegado en https://popayan-solar.vercel.app |
| [`gradio-app/`](gradio-app/README.md) | Ficha y captura del despliegue Gradio temporal salido de este notebook |

Los nombres se normalizaron (sin tildes) para evitar problemas de codificación entre Windows y GitHub.

## Hallazgos de la revisión

1. **🔴 Token de ngrok expuesto en el archivo original.** La celda 3 traía un token real pegado (`TOKEN_NGROK = "3Lhr…"`). Se **redactó** en las copias del repositorio y se sustituyó por lectura de `NGROK_AUTHTOKEN` desde Colab Secrets o variable de entorno. **Debes revocar ese token en el dashboard de ngrok**: ya estuvo en un archivo compartido y en el historial del chat.
2. **El notebook es autocontenido.** La celda 1 genera un dataset sintético de 1.000 hogares si no encuentra el CSV, o permite subirlo en Colab. Ya no depende de `files.upload()` obligatorio.
3. **El generador produce datos distintos a los del repo.** La celda 1 genera consumo medio ≈ 182,6 kWh/mes y target 35 %/35 %/30 % (Sí/No/Tal vez), mientras que `datos/solar_popayan/dataset_solar_popayan.csv` tiene 111,5 kWh/mes y 40 %/40 %/20 %. Si se ejecuta la celda 1 sin el CSV previo, los resultados **no serán comparables** con los del sitio web. Conviene copiar primero el CSV del repo a `/content/` (o a `.`). La [app Gradio desplegada](gradio-app/README.md) confirma esto: muestra 35 % de "Sí" y 183 kWh/mes, frente al 40 % y 111,5 kWh/mes del sitio.
4. **Las cifras del sitio web coinciden con el dataset del repo** (consumo 111,52; estratos 650/200/150; target 40/40/20), aunque `resumen.json` lo etiquete como `dataset_solar_popayan_v2.csv`. Ver [`sitio-web/README.md`](sitio-web/README.md).
5. **Sin otros secretos.** El escaneo no encontró claves, correos ni tokens adicionales.

## Cómo ejecutarlo

### En Google Colab (ruta prevista)
1. Abrir `notebooks/proyecto.ipynb` en Colab.
2. Celda 1: subir `dataset_solar_popayan.csv` cuando se solicite, o dejar que genere el sintético (ver advertencia 3).
3. Celda 2: pipeline completo.
4. Celda 3: crear el secreto `NGROK_AUTHTOKEN` en Colab antes de ejecutar el despliegue.

### Desde el repositorio
```powershell
python -m pip install -r modulos/07-proyecto-integrador/requirements.txt
Copy-Item datos\solar_popayan\dataset_solar_popayan.csv .
python modulos/07-proyecto-integrador/export_colab/proyecto.py
```
La celda de ngrok requiere la variable de entorno `NGROK_AUTHTOKEN`; sin ella solo imprime una advertencia y no publica el túnel.

## Relación con los entregables del diplomado

| Entregable | Evidencia |
| --- | --- |
| Caracterización, problema y alcance | Encabezado y celda 1 |
| Línea base e indicadores | Bloques de calidad y feature engineering de la celda 2 |
| Código fuente documentado | Notebook y export |
| Asistente/IA y analítica | Modelo multitarea y métricas de la celda 2 |
| Visualización y dashboard | Bloques de Plotly/Gradio y el sitio web |
| Viabilidad financiera | Ahorro, VPN, TIR y retorno |
| Trazabilidad | Salidas en `outputs/` (se regeneran; no versionadas) |

## Pendiente

- Revocar y rotar el token de ngrok filtrado.
- Fijar una sola fuente de datos (dataset del repo vs. generador de la celda 1).
- Agregar informe técnico, resumen ejecutivo y declaración de uso de IA para opción de grado.
