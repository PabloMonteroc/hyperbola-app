# ∿ Calculadora y Graficadora de Hipérbolas Pro

> Aplicación web interactiva de alto rendimiento para el análisis analítico y renderizado geométrico de hipérbolas en cálculo diferencial y geometría analítica.

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos
* **Node.js** (versión 18 o superior recomendada)
* **npm** (versión 9 o superior)

### Instalación y Ejecución

1. Entra al directorio de la aplicación:
   ```bash
   cd hiperbola-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Levanta el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
   Abre en tu navegador la URL que muestra la terminal (por defecto `http://localhost:5173`).

4. Ejecuta la suite de pruebas unitarias:
   ```bash
   npm test
   ```

5. Generar build optimizado para producción:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🎮 Cómo Usar la Herramienta

### 1. Parámetros Canónicos y Controles
En el panel lateral izquierdo puedes definir:
* **Orientación:** Selecciona entre eje focal **Horizontal** o **Vertical**.
* **Centro $(h, k)$:** Desplaza el origen de la hipérbola sobre el plano cartesiano.
* **Semieje transverso ($a$):** Distancia del centro a los vértices ($a > 0$).
* **Semieje conjugado ($b$):** Define la apertura y las asíntotas ($b > 0$).

### 2. Preajustes Rápidos (Presets)
Haz clic en los botones de acceso rápido para cargar casos de estudio típicos:
* **Unitaria:** $a = 1, b = 1$ centrada en el origen.
* **Canónica 3-4-5:** Ejemplo clásico con $a = 4, b = 3 \implies c = 5$.
* **Desplazada:** Centro trasladado a $(3, -2)$ con orientación vertical.

### 3. Interacción con el Lienzo (Canvas)
* **Pan (Mover el plano):** Haz clic izquierdo y arrastra el ratón.
* **Zoom Dinámico:** Usa la rueda del ratón (`scroll`) centrado en la posición del puntero.
* **Centrar Plano:** Haz clic en el botón *"Centrar Plano"* para reenfocar la vista en el centro $(h, k)$.

### 4. Lectura de Resultados
La barra lateral computa automáticamente y en tiempo real:
* **Ecuación Canónica:** $\frac{(x - h)^2}{a^2} - \frac{(y - k)^2}{b^2} = 1$
* **Ecuación General:** $Ax^2 + Cy^2 + Dx + Ey + F = 0$
* **Coordenadas exactas:** Centro $C$, Vértices $V_1, V_2$ y Focos $F_1, F_2$.
* **Métricas analíticas:** Distancia focal $c$ ($c^2 = a^2 + b^2$), Excentricidad $e = c/a$ ($e > 1$), y Lado Recto $LR = 2b^2/a$.
* **Ecuaciones de Asíntotas:** Desglosadas en forma punto-pendiente y forma pendiente-intersección ($y = mx + b$).

---

## 🛡️ Seguridad Anti-DDoS Integrada
El servidor Vite incluye un middleware nativo de mitigación Layer 7:
* **Rate Limiting:** Control de ráfagas por IP.
* **Auto-Ban:** Bloqueo temporal automático ante inundación de peticiones sospechosas.

---

## 📚 Documentación Técnica Completa
Para ver el marco teórico-matemático, deducción de fórmulas, arquitectura hexagonal y estándares de desarrollo, consulta:
👉 **[DOCUMENTACION.md](./DOCUMENTACION.md)**
