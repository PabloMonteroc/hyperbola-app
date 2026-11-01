# Reglas Esenciales y Stack Tecnológico: rf-hiperbola

## 1. Reglas Core
- **Cero código espagueti:** Mantener estricta separación entre la lógica matemática (motor de cálculo) y la interfaz gráfica.
- **Validación continua:** Cada commit o cambio significativo debe pasar por pruebas unitarias de los cálculos matemáticos (vértices, focos, asíntotas).
- **Enfoque Académico:** La precisión matemática es innegociable. Usar `c^2 = a^2 + b^2` para todas las derivaciones.

## 2. Framework y Librerías Recomendadas
- **Frontend Framework:** Vite con Vanilla JS (o React si se requiere escalabilidad).
- **Renderizado Gráfico:** HTML5 Canvas API nativo para control total del dibujo o Chart.js.
- **Cálculos Matemáticos:** `math.js` para manejo preciso de fracciones, raíces y valores absolutos.
- **Estilos:** Tailwind CSS para un diseño moderno, limpio y profesional (modo oscuro obligatorio).

## 3. Protocolo de Pruebas (Mandatorio)
- Al finalizar cada módulo, el agente DEBE compilar y probar los cambios simulando los inputs del PDF original.
- Verificar que el "rectángulo mágico" concuerde visualmente con las asíntotas.
- El agente probará todos los cambios levantando el entorno local antes de dar un paso por finalizado.
