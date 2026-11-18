# Módulo 7 — Proyecto integrador

**Autogeneración Solar Fotovoltaica en Hogares de Popayán, Cauca (2026-2030)**

Código y evidencias del proyecto integrador del diplomado. Está basado en el dataset [`datos/solar_popayan/`](../../datos/solar_popayan/README.md).

## Archivos

| Archivo | Qué es | Uso |
| --- | --- | --- |
| [`notebooks/Proyecto_Integrador_Solar_Popayan.ipynb`](notebooks/Proyecto_Integrador_Solar_Popayan.ipynb) | Notebook principal (2 celdas; la segunda tiene ~1.700 líneas) | Pipeline completo: ETL → EDA → ML supervisado y no supervisado → series temporales → optimización → economía circular → dashboard Gradio → exportación |
| [`notebooks/Autogeneracion_Solar_Fotovoltaica.ipynb`](notebooks/Autogeneracion_Solar_Fotovoltaica.ipynb) | Extensión de IA (8 celdas) | Stack neuronal: `HogarAdopcionNet` (PyTorch), entrenamiento/evaluación, LLM local y túnel ngrok para Gradio |
| [`export_colab/autogeneracion_solar_fotovoltaica.py`](export_colab/autogeneracion_solar_fotovoltaica.py) | Exportación automática de Colab del notebook anterior | **Solo como referencia/archivo fuente**: no es un script ejecutable fuera de Colab |
| [`sitio-web/`](sitio-web/README.md) | Copia del dashboard desplegado en https://popayan-solar.vercel.app | Divulgación del proyecto: 9 secciones y modelo SolarNet-MT corriendo en el navegador |

Los nombres de archivo se normalizaron (sin tildes) para evitar problemas de codificación entre Windows y GitHub. El contenido de los tres archivos se conservó íntegro.

## Hallazgos de la revisión

1. **Duplicación de código.** La celda grande de ~1.700 líneas aparece **idéntica** en los dos notebooks (solo difiere un salto de línea final). Conviene elegir uno como fuente canónica antes de seguir editando.
2. **Dependencia de Google Colab.** Los notebooks usan `from google.colab import files` y `userdata`, `!pip install` y el túnel ngrok. No corren tal cual en una terminal local.
3. **El `.py` no compila fuera de Colab.** Es un volcado automático que incluye la magia IPython `!pip install -q pyngrok` (línea 2228); `python -m py_compile` falla con `SyntaxError`. Es un archivo fuente de referencia, no un módulo importable.
4. **Ruta del dataset.** El código busca `dataset_solar_popayan*.csv` en `.`, `/content` y rutas de Colab, pero **no** en `datos/solar_popayan/`. Hay que copiar el CSV a la carpeta de trabajo o ampliar la lista de rutas.
5. **Datos sintéticos de respaldo.** La celda 3C genera un dataset alternativo de 200 filas si no encuentra el CSV, con categorías distintas a las reales (`Hogar`, `Plancha`). Si no se controla, puede producir resultados aparentemente válidos sobre datos incorrectos.
6. **Secretos: sin exposición.** El token de ngrok se toma de Colab Secrets (`userdata.get('NGROK_AUTHTOKEN')`); no hay tokens ni claves escritos en el código. Las salidas guardadas contienen un enlace Gradio temporal ya expirado.
7. **Detalles menores:** en la celda 1B hay dos comprobaciones inalcanzables (`umap`/`faiss` dentro de un `if spec is None`); en la 3C, `torch.load` no especifica `map_location`, y `BatchNorm1d` puede fallar con lotes de una sola fila.

## Cómo ejecutarlo

### En Google Colab (ruta prevista por el autor)
1. Abrir el notebook principal en Colab.
2. Celda 1: subir `dataset_solar_popayan.csv` cuando aparezca el selector de archivos.
3. Celda 2: ejecutar el pipeline completo (instala dependencias faltantes y escribe en `outputs/`).
4. Opcional, en el notebook de IA: configurar el secreto `NGROK_AUTHTOKEN` en Colab para publicar el dashboard.

### Desde este repositorio (sin Colab)
```powershell
# 1. Colocar el dataset donde el código lo encuentra
Copy-Item datos\solar_popayan\dataset_solar_popayan.csv .

# 2. Instalar dependencias
python -m pip install -r modulos/07-proyecto-integrador/requirements.txt

# 3. Ejecutar con publicación desactivada
$env:NO_LAUNCH="1"
python modulos/07-proyecto-integrador/export_colab/autogeneracion_solar_fotovoltaica.py
```
> El paso 3 aún requiere quitar la magia `!pip` y los imports de `google.colab` del export; la forma recomendada por ahora es Colab.

## Relación con los entregables del diplomado

| Entregable del Módulo 7 | Evidencia en estos archivos |
| --- | --- |
| Caracterización, problema y alcance | Encabezado y bloques iniciales del pipeline |
| Línea base e indicadores | Bloques de calidad de datos e ingeniería de características |
| Código fuente documentado | Ambos notebooks y el export |
| Asistente local / IA | Celdas 1B, 3B y 3C (`HogarAdopcionNet`, LLM) |
| Visualización y dashboard | Bloques de Plotly y Gradio |
| Viabilidad financiera | Bloques de ahorro, VPN, TIR y retorno |
| Trazabilidad | Salidas en `outputs/` (no versionadas; se regeneran al ejecutar) |

## Pendiente

- Unificar la celda duplicada en una sola fuente.
- Localizar o regenerar `dataset_solar_popayan_v2.csv`, usado por el sitio web (el repositorio solo conserva la v1).
- Separar la configuración de entorno (Colab vs local) y eliminar la magia `!pip` del export.
- Agregar el informe técnico, el resumen ejecutivo y la declaración de uso de IA exigidos para opción de grado.
