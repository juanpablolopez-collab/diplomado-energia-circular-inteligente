# Código

El código del proyecto se conserva en los módulos donde se produce, para mantener la trazabilidad exigida por el diplomado.

## Ubicación

| Tipo | Ruta |
| --- | --- |
| Notebook principal y exportación Python | [`modulos/07-proyecto-integrador/notebooks/`](../modulos/07-proyecto-integrador/notebooks/) y [`export_colab/`](../modulos/07-proyecto-integrador/export_colab/) |
| Sitio web estático (HTML/CSS/JS y JSON) | [`modulos/07-proyecto-integrador/sitio-web/`](../modulos/07-proyecto-integrador/sitio-web/) |
| Ficha de la app Gradio | [`modulos/07-proyecto-integrador/gradio-app/`](../modulos/07-proyecto-integrador/gradio-app/) |
| Generación de figuras del artículo | [`documento/ieee/generar_figuras.py`](../documento/ieee/generar_figuras.py) |
| Conversión de gráficas Plotly | [`documento/ieee/convertir_graficas.py`](../documento/ieee/convertir_graficas.py) |
| Generación de apéndices LaTeX | [`documento/ieee/generar_apendices.py`](../documento/ieee/generar_apendices.py) |

## Convenciones

- Los scripts llevan nombres en ASCII para evitar problemas de codificación entre Windows y GitHub.
- Los pesos de modelos (`.pt`, `.joblib`) no se versionan individualmente: se conservan dentro del ZIP de [`entregables/`](../entregables/INVENTARIO.md).
- Los datos sensibles se anonimizan antes de versionarse; las reglas están en [`datos/README.md`](../datos/README.md).

## Entorno

El pipeline principal está preparado para Google Colab y usa `google.colab` de forma defensiva, por lo que también puede ejecutarse localmente con las dependencias de [`requirements.txt`](../modulos/07-proyecto-integrador/requirements.txt). El token de ngrok se lee de `NGROK_AUTHTOKEN` y **nunca** se escribe en el código.
