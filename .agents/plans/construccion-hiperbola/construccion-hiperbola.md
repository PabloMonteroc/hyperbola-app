# Plan de Construcción: Calculadora/Graficadora de Hipérbolas

## Finalidad
Desarrollar una herramienta web interactiva que automatice y renderice los ejercicios de cálculo diferencial sobre hipérbolas, con el objetivo de obtener una calificación extra (+1) demostrando dominio absoluto de la programación estructurada.

## Fases de Construcción

### Fase 1: Setup y Arquitectura Base
- Inicializar proyecto con Vite.
- Crear estructura de carpetas aplicando conceptos de dominio (`src/domain/math`, `src/adapters/ui`, `src/adapters/canvas`).

### Fase 2: Motor Matemático (El Cerebro)
- Desarrollar módulo que reciba entradas manuales (a, b, h, k).
- Calcular $c = \sqrt{a^2 + b^2}$.
- Generar arrays de puntos para renderizar las ramas de la hipérbola.
- Calcular ecuaciones de asíntotas y focos.

### Fase 3: Interfaz de Usuario (UI)
- Crear controles input limpios.
- Implementar panel lateral de resultados que muestre el desglose matemático (procedimiento paso a paso).

### Fase 4: Renderizado Visual
- Dibujar plano cartesiano responsivo.
- Dibujar rectángulo central usando `a` y `b`.
- Trazar diagonales completas (asíntotas).
- Dibujar la curva hiperbólica.

## Pruebas Requeridas
- **Test 1:** Ingresar ecuación $x^2/9 - y^2/16 = 1$. Debe arrojar $F=(\pm5, 0)$ y asíntotas $y=\pm(4/3)x$.
- **Test 2:** Comprobar el cambio de centro a $(2, -1)$.
- **Test 3:** Verificar la diferencia de distancias constante $|PF - PG| = 2a$ para cualquier punto interactivo.

## Resultados Esperados
- Una aplicación web robusta, modular, mantenible y visualmente impactante que automatice la validación de los ejercicios del profesor.
