# Sensor IoT de consumo con ESP32 o Raspberry Pi

| Campo | Valor |
| --- | --- |
| Módulo | Módulo 2 |
| Duración sugerida | 4 horas |
| Evidencia | Prototipo funcional, código documentado y captura del tablero. |

## Objetivo

Prototipar un sistema de adquisición de datos de consumo.

## Prerrequisitos

Electrónica básica; programación de microcontroladores.

## Descripción

Construir un sensor de corriente/tensión con ESP32 o Raspberry Pi y enviar datos a un broker local.

## Procedimiento

1. Montar el circuito sobre banco didáctico.
2. Configurar lectura y calibración del sensor.
3. Publicar datos MQTT en Mosquitto.
4. Visualizar series en InfluxDB/Grafana.

## Evidencias de aprendizaje

Prototipo funcional, código documentado y captura del tablero.

## Criterios de calidad y seguridad

- Registrar datos, unidades, supuestos e incertidumbre.
- Conservar archivos fuente y versiones.
- No manipular instalaciones energizadas sin autorización.
- Validar con persona competente los resultados que impliquen seguridad o dimensionamiento.

## Relación con el proyecto integrador

Los resultados de esta guía se integran como producto parcial en el [Módulo 7](../../modulos/07-proyecto-integrador/README.md).
