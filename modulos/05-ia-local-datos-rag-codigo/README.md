# Módulo 05 — Inteligencia artificial local, datos, RAG y desarrollo de código

| Campo | Valor |
| --- | --- |
| Distribución | 8 teóricas + 10 prácticas = 18 h |
| Peso en la evaluación | 15 % |
| Evidencia principal | Asistente local RAG funcional, repositorio de código, pruebas, ficha técnica y reporte de consumo de recursos. |

## Descripción

Núcleo digital del diplomado. No se delega el razonamiento al modelo: se construye infraestructura local para consultar documentación, revisar código, preparar análisis y producir borradores verificables.

## Propósito formativo

Configurar un entorno local de IA que transforme datos y documentos energéticos en análisis reproducibles y productos verificables.

## Contenidos

### Conceptuales

Modelos de lenguaje, tokenización, contexto, cuantización, inferencia CPU/GPU, GGUF, embeddings, bases vectoriales, RAG, chunking, metadatos, citas, agentes, API local, privacidad, licencias, alucinaciones, evaluación y consumo computacional. GPT4All, AnythingLLM, Ollama, Open WebUI y LM Studio.

### Procedimentales

Instalación de entornos, descarga controlada de modelos, ejecución sin Internet, corpus documental, embeddings y recuperación, comparación con/sin RAG, API local con Python, generación y documentación de código, asistente con citas y medición de recursos.

### Actitudinales

Confidencialidad, minimización de datos, atribución de fuentes, revisión de licencias y validación de cada cálculo. Explicar qué fue calculado, generado y revisado por persona competente.

## Prácticas y laboratorios

- Instalación local de GPT4All y modelo cuantizado en CPU o GPU.
- Configuración de AnythingLLM con proveedor local y base vectorial.
- Corpus RAG con ISO, política pública, manuales y datos anonimizados.
- Pruebas para detectar respuestas sin evidencia o referencias inventadas.
- Generación asistida de código Python para limpieza, indicadores, pronóstico y visualización.
- API o aplicación local con Streamlit o Gradio.
- Comparación de desempeño entre equipo básico y estación RTX 3050.
- Ficha de modelo con versión, licencia, requisitos, riesgos y uso permitido.

## Herramientas y entornos sugeridos

- GPT4All y servidor API local
- AnythingLLM, Ollama, Open WebUI, LM Studio
- Python, Jupyter, VS Code, Git, Streamlit y Gradio
- LanceDB o Chroma
- Prometheus cuando aplique

## Contextualización territorial

Consulta normativa de comunidades energéticas, apoyo a auditorías, manuales de inversores, análisis de consumos, bombeo y formación. Sin datos personales o comerciales reales sin autorización y anonimización.

## Evidencia de aprendizaje

Asistente local RAG funcional, repositorio de código, pruebas, ficha técnica y reporte de consumo de recursos.

## Normativa relacionada

- [`normativa/modulo-05-inteligencia-artificial-y-datos/`](../../normativa/modulo-05-inteligencia-artificial-y-datos/README.md)

## Artefactos del repositorio

- guias/profesores/prompts/
- modulos/07-proyecto-integrador/notebooks/proyecto.ipynb

## Guías de laboratorio sugeridas

Ver [`guias-laboratorio/`](../../guias-laboratorio/README.md), donde se detallan las 15 prácticas con objetivos, procedimiento y evidencias.

## Estado

Documentación del módulo completada a partir de la propuesta oficial del diplomado (`documento/`). Los productos parciales se construyen en las prácticas y se consolidan en el [Módulo 7](../07-proyecto-integrador/README.md).
