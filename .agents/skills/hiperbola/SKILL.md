# Habilidades y Estándares de Programación (Hiperbola)

## 1. Paradigma de Programación Único
- Utilizar principios de **Arquitectura Hexagonal / Clean Architecture** adaptados al frontend. Aislar completamente el "Dominio" (la lógica de la hipérbola) de los adaptadores (UI, Canvas).
- Aplicar programación funcional para el motor matemático: funciones puras sin efectos secundarios. Entrada (a,b,h,k) -> Salida (coordenadas completas).

## 2. Procesos Estandarizados
- **Manejo de Estados:** Evitar variables globales. 
- **Nomenclatura:** 
  - Funciones en camelCase verbosas e intuitivas: `calculateAsymptotes()`, `drawReferenceRectangle()`.
  - Constantes matemáticas en MAYÚSCULAS: `CENTER_X`, `SEMI_TRANSVERSE_AXIS`.

## 3. Prevención de Errores
- Validar siempre que `a > 0` y `b > 0` antes de cualquier cálculo.
- Manejar la división por cero en las pendientes de las asíntotas cuando el eje cambie.
- Aislar el renderizado del canvas en `requestAnimationFrame` para un redibujado óptimo.
