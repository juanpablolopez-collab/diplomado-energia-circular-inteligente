# Guías y ejemplos de los profesores

Material compartido por los docentes del Diplomado en Energía Circular Inteligente 5.0 (Unicomfacauca), descargado de la carpeta de Google Drive compartida el 18/11/2026. Se conserva íntegro como referencia metodológica del proyecto integrador.

**Carpeta de origen:** https://drive.google.com/drive/folders/1iQD0NUGzKlK6JdPG0gHRmJYjw1st9cuf

## Inventario

| Subcarpeta | Archivo | Descripción |
| --- | --- | --- |
| `diplomado-energia-ia/` | `Diplomado_Energia_Circular_Inteligente.md` / `.pdf` | Propuesta oficial del diplomado (24 páginas; versión Markdown y PDF) |
| `diplomado-energia-ia/` | `Explorador_de_escenarios_Planta_de_cafe_Cauca.ipynb-Colab.pdf` | Ejemplo de notebook con datos sintéticos de una planta de café del Cauca: EDA y explorador de escenarios en Gradio (6 páginas) |
| `diplomado-energia-ia/` | `kimi-diplomado_energia_unicomfa_sep_oct2026.pdf` | Material de apoyo generado con Kimi sobre transición energética y módulos del diplomado (63 páginas) |
| `diplomado-energia-ia/` | `perplexity-diplomado_energia_unicomfa_sep_oct2026.pdf` | Material docente de la primera sesión generado con Perplexity (47 páginas) |
| `prompts/` | `PROMPTS.docx` | Ejemplos de prompts para dashboards Gradio: calculadora, EDA con iris, EDA + red neuronal con california housing, y pestaña de conclusiones |
| `prompts/` | `Estructura de un buen prompt-diplomado-IA-Unicomfa.txt` | Estructura ROL → CONTEXTO → TAREA → EJEMPLOS → FORMATO y uso del "prompt maestro" |
| `enlaces/` | `Link to colab notebooks.docx` | Enlace a la carpeta de notebooks de Colab |
| `enlaces/` | `Links compartidos.docx` | Enlaces a MarkItDown, el paper *Attention is all you need* y esquemas de transformers |
| `datasets-inventado/` | `dataset-inventado.csv` / `.json` / `.xls` | Dataset inventado de ejemplo en tres formatos |

## Aportes al proyecto

1. **Patrón de dashboard esperado.** Los ejemplos de los profesores organizan la interfaz Gradio en pestañas de *dataframe, estadísticas, distribuciones univariadas, bivariadas y multivariadas, matriz de correlación y conclusiones*. La app del Módulo 7 sigue ese patrón y lo amplía a 24 pestañas.
2. **Estructura de prompt.** La secuencia ROL → CONTEXTO → TAREA → EJEMPLOS (+/−) → FORMATO de salida se usa para documentar los flujos generativos del diplomado.
3. **Datos sintéticos con aviso ético.** El explorador de escenarios de la planta de café declara explícitamente que sus datos son ilustrativos, criterio adoptado en el dataset de Popayán y en el artículo IEEE.
4. **Trazabilidad.** Los materiales se conservan aquí y se citan en el apéndice metodológico del artículo (`documento/ieee/`).

## Notas

- Los documentos `.docx` se conservan en su formato original; su texto fue extraído para el índice sin modificarlos.
- El archivo con tilde en el nombre original se renombró a ASCII para evitar problemas de codificación entre Windows y GitHub.
- Las carpetas `profe-Juan-pendiente` y `Diplomado-IA-local` de Drive estaban vacías; su contenido efectivo es el descrito arriba.
