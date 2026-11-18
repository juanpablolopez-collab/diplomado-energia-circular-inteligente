# Sitio web del proyecto integrador

**URL en producción:** https://popayan-solar.vercel.app/#resumen

Dashboard estático de divulgación del proyecto *Autogeneración Solar Fotovoltaica en Hogares de Popayán, Cauca (2026-2030)*. Toda la inferencia y las visualizaciones se ejecutan **en el navegador**: no hay backend ni base de datos en servidor.

> Esta carpeta es una **copia instantánea** del sitio desplegado, tomada el 18/11/2026. No se sincroniza automáticamente con Vercel: si el sitio en vivo cambia, hay que volver a capturar los archivos.

## Secciones

Resumen · Hogares · Red neuronal · Simulador · Segmentos · Pronóstico · Subsidios · Economía circular · Acerca de.

Las cifras del resumen (1.000 hogares sintéticos, 77,7 % de exactitud en la decisión sí/no, 64,4 % en tres clases y R² = 0,98 para el ahorro anual) se presentan como **hipótesis a validar con datos reales**, con aviso explícito de Ley 1581 de 2012.

## Archivos de la instantánea

| Archivo | Tamaño | Contenido |
| --- | ---: | --- |
| `index.html` | 1,6 KB | Estructura; carga Plotly desde CDN y los tres scripts locales |
| `css/style.css` | 5 KB | Estilos |
| `js/solarnet.js` | 6,2 KB | Red neuronal `SolarNet-MT` implementada en JavaScript (inferencia en cliente) |
| `js/herramientas.js` | 5,9 KB | Utilidades de interfaz |
| `js/app.js` | 43,3 KB | Secciones, gráficos y simulador |
| `data/resumen.json` | 5,4 KB | Indicadores agregados, segmentos, optimización de subsidios, RAEE y pronóstico |
| `data/nn_resultados.json` | 10,5 KB | Métricas, curvas ROC, matriz de confusión, calibración, importancia y equidad |
| `model/solarnet.json` | 912 KB | Pesos, normalización y constantes del modelo (9.086 parámetros) |

## Datos y procedencia

- `data/resumen.json` declara como origen **`dataset_solar_popayan_v2.csv`**, con 1.000 hogares sintéticos.
- **El nombre "v2" es engañoso**: al contrastar las cifras del JSON con el dataset del repositorio, coinciden exactamente (consumo medio 111,52 kWh/mes; estratos 650/200/150; target 40 %/40 %/20 %). Es decir, los resultados parecen calculados sobre [`datos/solar_popayan/dataset_solar_popayan.csv`](../../../datos/solar_popayan/README.md), no sobre un archivo distinto.
- El generador de la celda 1 del notebook correcto sí produce otro dataset (consumo ≈ 182,6 y target 35/35/30), por lo que **no** corresponde a estos resultados.
- El modelo y las métricas son resultados offline; el sitio solo los consume.

## Ejecutar localmente

```powershell
cd modulos/07-proyecto-integrador/sitio-web
python -m http.server 8000
# abrir http://localhost:8000/#resumen
```

Requiere conexión a Internet para cargar Plotly desde `cdn.plot.ly`.

## Publicación

El despliegue es estático en Vercel. Para actualizarlo, reemplazar los archivos de esta carpeta en el proyecto de Vercel y volver a desplegar; no hay pasos de compilación ni variables de entorno.

## Relación con el diplomado

Sirve como evidencia de los entregables *producto visual*, *comunicación del proyecto* y *apropiación tecnológica* del Módulo 7, y muestra el uso de IA local: el modelo corre en el navegador del usuario sin enviar datos a un servidor.
