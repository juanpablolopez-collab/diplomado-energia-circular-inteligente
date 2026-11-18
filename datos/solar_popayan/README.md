# Dataset solar — Popayán, Cauca

`dataset_solar_popayan.csv`: 1.000 registros de hogares con variables socioeconómicas, de consumo eléctrico, potencial fotovoltaico, indicadores financieros y disposición hacia tecnologías de IA y comunidades energéticas.

| Propiedad | Valor |
| --- | --- |
| Filas | 1.000 (`id_hogar` H0001–H1000, sin duplicados) |
| Columnas | 99 |
| Valores vacíos | 0 |
| Codificación | UTF-8 |
| Zona | 500 rural / 500 urbana |
| Uso principal | Módulos 3, 5 y 7 del diplomado |

> **Advertencia de proveniencia:** la distribución de las muestras (500/500 rural-urbana, estratos 1–3, ID secuenciales y relaciones exactas entre variables) sugiere un conjunto **sintético o simulado**. Verificar su origen antes de usarlo como evidencia real en informes, auditorías o sustentaciones. Los hogares están identificados solo por un código anónimo; aun así, contiene ingresos y datos socioeconómicos, por lo que no debe redistribuirse fuera del ámbito académico sin autorización.

## Diccionario de datos

### 1. Identificación y localización (6)
| Columna | Tipo | Descripción |
| --- | --- | --- |
| `id_hogar` | texto | Identificador anónimo (H0001…H1000) |
| `comuna` | texto | Comuna (zona urbana) o localidad/rural |
| `barrio` | texto | Barrio o vereda |
| `estrato` | entero | Estrato socioeconómico (1–3) |
| `tipo_vivienda` | texto | Vivienda rural, Casa, Apartamento |
| `zona` | texto | Rural / Urbana |

### 2. Características del hogar (8)
| Columna | Tipo | Unidad |
| --- | --- | --- |
| `num_personas` | entero | personas |
| `num_menores` | entero | personas |
| `num_adultos_mayores` | entero | personas |
| `ingreso_mensual_cop` | numérico | COP/mes |
| `jefe_hogar_genero` | texto | M / F |
| `nivel_educativo` | texto | Primaria, Secundaria, Técnico, Universitario |
| `ocupacion_principal` | texto | Empleado, Independiente, Pensionado, Desempleado, Estudiante |
| `tiene_empresa` | texto | Sí / No |

### 3. Vivienda y cubierta (7)
| Columna | Tipo | Unidad / valores |
| --- | --- | --- |
| `area_vivienda_m2` | numérico | m² |
| `area_cubierta_m2` | numérico | m² |
| `tipo_cubierta` | texto | Teja de barro, Eternit, Zinc, Losa de concreto |
| `inclinacion_cubierta_grados` | numérico | grados (5–35) |
| `orientacion_cubierta` | texto | Norte, Sur, Este, Oeste, Plana |
| `sombras_presentes` | texto | Sí / No |
| `sombras_descripcion` | texto | Ninguna, Árboles, Edificios, Postes, combinaciones |

### 4. Consumo y facturación (12)
| Columna | Tipo | Unidad |
| --- | --- | --- |
| `consumo_kwh_mes` | numérico | kWh/mes |
| `consumo_kwh_dia_promedio` | numérico | kWh/día |
| `demanda_maxima_kw` | numérico | kW |
| `factor_carga` | numérico | adimensional |
| `costo_factura_mes_cop` | numérico | COP/mes |
| `tarifa_kwh_cop` | numérico | COP/kWh |
| `consumo_anual_kwh` | numérico | kWh/año |
| `variacion_estacional_pct` | numérico | % |
| `mes_mayor_consumo` / `mes_menor_consumo` | texto | mes del año |
| `tiene_medidor_inteligente` | texto | Sí / No |
| `recibe_subsidio` | texto | Sí / No |

### 5. Inventario de cargas (12)
Pares `num_X` (cantidad) y `potencia_X_w` (potencia unitaria en W) para: `nevera`, `tv`, `lavadora`, `ventilador`, `bombilla_led`, más `num_computadores` y `num_equipos_especiales`.

### 6. Perfil horario (24)
`h00` … `h23`: **kWh consumidos en cada hora**. La suma de las 24 columnas es igual a `consumo_kwh_dia_promedio`.

### 7. Recurso solar y dimensionamiento (8)
| Columna | Unidad |
| --- | --- |
| `radiacion_promedio_kwh_m2_dia` | kWh/m²/día |
| `horas_sol_pico` | h/día |
| `generacion_potencial_kwp` | kWp |
| `num_paneles_estimados` | paneles |
| `potencia_panel_w` | W por panel |
| `area_requerida_m2` | m² |
| `generacion_diaria_estimada_kwh` | kWh/día |
| `generacion_mensual_estimada_kwh` | kWh/mes |

### 8. Viabilidad financiera (9)
`inversion_estimada_cop`, `costo_kwp_cop`, `ahorro_mensual_cop`, `ahorro_anual_cop`, `porcentaje_ahorro`, `retorno_simple_meses`, `retorno_simple_anios`, `vpn_10_anios_cop`, `tir_porcentaje`.

### 9. Adopción y contexto (13)
`requiere_financiacion`, `fuente_financiacion`, `dispositivo_ia_interes`, `nivel_apropiacion_tecnologica`, `tiene_internet`, `tiene_smartphone`, `interes_comunidad_energetica`, `conoce_reciclaje_paneles`, `dispuesto_instalar_paneles`, `principal_barrera`, `principal_motivacion`, `disposicion_pago_mensual_cop`, `prioridad_gobierno`.

## Chequeos de consistencia verificados

- `consumo_kwh_dia_promedio × 30 = consumo_kwh_mes` (100 % de los registros).
- `consumo_anual_kwh = 12 × consumo_kwh_mes` (100 %).
- `ahorro_anual_cop = 12 × ahorro_mensual_cop` (100 %).
- `inversion_estimada_cop = generacion_potencial_kwp × costo_kwp_cop` (100 %).
- `suma(h00…h23) = consumo_kwh_dia_promedio` (100 %).

## Usos sugeridos en el diplomado

- **Módulo 2:** línea base, indicadores de desempeño, curva de carga horaria y Pareto de cargas.
- **Módulo 3:** caracterización solar, pre-dimensionamiento fotovoltaico y análisis de sensibilidad.
- **Módulo 5:** limpieza y análisis en Python, API local, tableros y corpus para asistente RAG.
- **Módulo 7:** caso de estudio del proyecto integrador *Autogeneración solar fotovoltaica en hogares de Popayán*.
