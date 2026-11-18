# Entregables descargables del proyecto integrador

Paquete: [`resultados_proyecto_solar_popayan.zip`](resultados_proyecto_solar_popayan.zip) · 17,7 MB · obtenido el 18/11/2026 desde la pestaña *Conclusiones* de la app Gradio del proyecto.

Contenido: **108 archivos** — 1 metadata, 52 gráficos HTML interactivos, 38 tablas CSV y 17 modelos.

## Conclusiones mostradas en la app

- Mejor clasificador por CV: Regresión Logística (AUC macro 0,496; F1-macro test 0,340).
- La comparativa incluye la Red Neuronal Multimodal PyTorch con rama Conv1d sobre el perfil horario.
- SHAP sobre Random Forest; Permutation Importance sobre el modelo final.
- Fairness auditada por estrato, zona y género del jefe del hogar.

> Advertencia: estos resultados usan el dataset sintético generado por la Celda 1 del notebook (35 % de "Sí", 183 kWh/mes), no el dataset versionado en `datos/solar_popayan/` (40 %, 111,5 kWh/mes).

## Metadata (1)

- `metadatos.json` — 3.2 KB

## Gráficos HTML interactivos (52)

- `analisis_target.html` — 23.9 KB
- `clf_calibracion.html` — 11.3 KB
- `clf_comparacion_modelos.html` — 12.3 KB
- `clf_cv_f1.html` — 8.3 KB
- `clf_matriz_confusion.html` — 9.4 KB
- `clf_permutation_importance.html` — 8.8 KB
- `clf_roc_pr.html` — 37.3 KB
- `clf_shap_beeswarm_si.html` — 215.2 KB
- `clf_shap_force_ejemplo.html` — 8.6 KB
- `clf_shap_resumen.html` — 9.8 KB
- `dbscan_atipicos.html` — 56.3 KB
- `dbscan_kdistancia.html` — 26.3 KB
- `dendrograma_clustering.html` — 34.6 KB
- `dendrograma_eda.html` — 27.9 KB
- `eda_bivariado_consumo_ingreso.html` — 54.3 KB
- `eda_bivariado_inversion_ahorro.html` — 58.0 KB
- `eda_univariado_consumo_kwh_mes.html` — 21.4 KB
- `eda_univariado_dispuesto_instalar_paneles.html` — 9.2 KB
- `eda_univariado_ingreso_mensual_cop.html` — 27.9 KB
- `eda_univariado_retorno_simple_anios.html` — 18.8 KB
- `fairness_estrato.html` — 9.0 KB
- `fairness_zona.html` — 8.9 KB
- `kmeans_pca.html` — 47.3 KB
- `kmeans_perfil_heatmap.html` — 8.9 KB
- `kmeans_perfil_horario.html` — 10.9 KB
- `kmeans_seleccion_k.html` — 9.5 KB
- `matriz_correlacion.html` — 11.8 KB
- `nn_curvas_entrenamiento.html` — 9.1 KB
- `opt_con_equidad.html` — 9.1 KB
- `opt_frontera_equidad.html` — 8.3 KB
- `opt_sensibilidad_presupuesto.html` — 9.2 KB
- `opt_sin_equidad.html` — 9.0 KB
- `pareto_barreras.html` — 8.8 KB
- `pareto_segmentos.html` — 11.9 KB
- `pca_2d.html` — 48.8 KB
- `pca_3d.html` — 67.9 KB
- `pca_varianza.html` — 8.4 KB
- `raee_ciclo_vida.html` — 9.2 KB
- `raee_escenario_1.html` — 11.1 KB
- `raee_escenario_2.html` — 11.0 KB
- `raee_escenario_3.html` — 10.6 KB
- `reg_comparacion.html` — 8.1 KB
- `reg_diagnostico_ahorro_anual_cop.html` — 43.1 KB
- `reg_diagnostico_retorno_simple_anios.html` — 42.7 KB
- `ts_acf_pacf_consumo.html` — 10.8 KB
- `ts_anomalias.html` — 37.4 KB
- `ts_pronostico_consumo.html` — 11.1 KB
- `ts_pronostico_generacion.html` — 11.1 KB
- `ts_series.html` — 67.7 KB
- `ts_stl_consumo_diaria.html` — 127.1 KB
- `ts_stl_consumo_mensual.html` — 13.1 KB
- `tsne_2d.html` — 30.9 KB

## Tablas CSV (38)

- `calidad_datos.csv` — 0.5 KB
- `clasificacion_calibracion.csv` — 0.1 KB
- `clasificacion_comparacion_modelos.csv` — 1.1 KB
- `clasificacion_permutation_importance.csv` — 1.1 KB
- `clasificacion_shap_importancia.csv` — 1.5 KB
- `correlaciones_spearman.csv` — 3.3 KB
- `dataset_modelado.csv` — 826.5 KB
- `dbscan_hogares_atipicos.csv` — 1.1 KB
- `diccionario_datos.csv` — 7.3 KB
- `estadisticas_descriptivas_modelo.csv` — 1.9 KB
- `fairness_estrato.csv` — 0.2 KB
- `fairness_estrato_zona.csv` — 0.4 KB
- `fairness_jefe_hogar_genero.csv` — 0.2 KB
- `fairness_zona.csv` — 0.2 KB
- `hogares_con_segmentos.csv` — 59.8 KB
- `kmeans_perfil_segmentos.csv` — 0.5 KB
- `kmeans_seleccion_k.csv` — 0.4 KB
- `optimizacion_con_equidad_50.csv` — 0.4 KB
- `optimizacion_frontera_equidad.csv` — 0.2 KB
- `optimizacion_parametros_por_estrato.csv` — 0.3 KB
- `optimizacion_sin_equidad.csv` — 0.4 KB
- `pareto_barreras.csv` — 0.2 KB
- `pareto_segmentos.csv` — 1.6 KB
- `pca_cargas.csv` — 0.8 KB
- `raee_escenario_1.csv` — 3.9 KB
- `raee_escenario_2.csv` — 4.0 KB
- `raee_escenario_3.csv` — 3.1 KB
- `regresion_ahorro_anual_cop.csv` — 0.4 KB
- `regresion_importancia_ahorro_anual_cop.csv` — 0.3 KB
- `regresion_importancia_retorno_simple_anios.csv` — 0.3 KB
- `regresion_retorno_simple_anios.csv` — 0.3 KB
- `resumen_por_estrato.csv` — 0.3 KB
- `serie_diaria_sintetica.csv` — 24.7 KB
- `serie_mensual_sintetica.csv` — 0.9 KB
- `ts_anomalias_detectadas.csv` — 0.4 KB
- `ts_backtest_6_meses.csv` — 0.3 KB
- `ts_pronostico_12_meses.csv` — 0.8 KB
- `winsorizacion.csv` — 0.3 KB

## Modelos entrenados (17)

- `anomalias_isolation_forest.joblib` — 690.1 KB
- `clf_LightGBM.joblib` — 406.4 KB
- `clf_MLP_sklearn_128_64_32.joblib` — 403.6 KB
- `clf_Random_Forest.joblib` — 910.2 KB
- `clf_Red_Neuronal_Multimodal_PyTorch.joblib` — 142.8 KB
- `clf_Regresi_n_Log_stica.joblib` — 4.3 KB
- `clf_SVM_RBF.joblib` — 104.4 KB
- `clf_Stacking.joblib` — 1820.0 KB
- `clf_modelo_final_simulador.joblib` — 14.9 KB
- `clustering_kmeans.joblib` — 2.8 KB
- `nn_hogar_adopcion.pt` — 161.6 KB
- `reg_ahorro_anual_cop.joblib` — 88.4 KB
- `reg_retorno_simple_anios.joblib` — 5777.3 KB
- `ts_prophet_consumo.json` — 117.8 KB
- `ts_prophet_generacion.json` — 117.8 KB
- `ts_sarimax_consumo.joblib` — 5557.5 KB
- `ts_sarimax_generacion.joblib` — 1616.8 KB
