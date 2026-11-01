# 📐 Documentación Técnica y Matemática Completa
## Calculadora y Graficadora de Hipérbolas Pro

---

## Índice
1. [Marco Teórico y Fundamentos Matemáticos](#1-marco-teórico-y-fundamentos-matemáticos)
   - [1.1 Definición como Lugar Geométrico](#11-definición-como-lugar-geométrico)
   - [1.2 Relación Fundamental c² = a² + b²](#12-relación-fundamental-c--a--b)
   - [1.3 Ecuaciones Canónicas](#13-ecuaciones-canónicas)
   - [1.4 Elementos Notables](#14-elementos-notables)
   - [1.5 Deducción de las Asíntotas](#15-deducción-de-las-asíntotas)
   - [1.6 El Rectángulo Fundamental ("Rectángulo Mágico")](#16-el-rectángulo-fundamental-rectángulo-mágico)
   - [1.7 Conversión a Ecuación General](#17-conversión-a-ecuación-general)
   - [1.8 Parametrización por Funciones Hiperbólicas](#18-parametrización-por-funciones-hiperbólicas)
2. [Arquitectura del Software (Clean Architecture)](#2-arquitectura-del-software-clean-architecture)
   - [2.1 Principios de Diseño Hexagonal](#21-principios-de-diseño-hexagonal)
   - [2.2 Estructura de Directorios](#22-estructura-de-directorios)
   - [2.3 Motor Matemático Puro (Domain Math)](#23-motor-matemático-puro-domain-math)
   - [2.4 Parser de Ecuaciones Canónicas](#24-parser-de-ecuaciones-canónicas)
3. [Sistema de Seguridad y Mitigación Anti-DDoS](#3-sistema-de-seguridad-y-mitigación-anti-ddos)
   - [3.1 Algoritmo de Ventana Deslizante (Sliding Window)](#31-algoritmo-de-ventana-deslizante-sliding-window)
   - [3.2 Política de Auto-Ban y Rate Limiting](#32-política-de-auto-ban-y-rate-limiting)
   - [3.3 Headers y Respuestas HTTP](#33-headers-y-respuestas-http)
4. [Protocolo y Suite de Pruebas Unitarias](#4-protocolo-y-suite-de-pruebas-unitarias)
   - [4.1 Cobertura de Casos Obligatorios](#41-cobertura-de-casos-obligatorios)
   - [4.2 Ejecución y Resultados](#42-ejecución-y-resultados)

---

## 1. Marco Teórico y Fundamentos Matemáticos

### 1.1 Definición como Lugar Geométrico
Una **hipérbola** es el lugar geométrico de todos los puntos $P(x, y)$ en el plano tales que el valor absoluto de la diferencia de sus distancias a dos puntos fijos $F_1$ y $F_2$ (denominados **focos**) es constante e igual a $2a$:

$$|d(P, F_1) - d(P, F_2)| = 2a$$

Donde:
* $d(P, F_i) = \sqrt{(x - x_{Fi})^2 + (y - y_{Fi})^2}$ representa la distancia euclidiana del punto $P$ al foco $F_i$.
* $a > 0$ es la longitud del **semieje transverso** (o real).
* $2a$ representa la distancia mínima entre las dos ramas de la curva (distancia entre vértices).

### 1.2 Relación Fundamental $c^2 = a^2 + b^2$
En toda hipérbola se cumple estrictamente la relación pitagórica:

$$c^2 = a^2 + b^2 \implies c = \sqrt{a^2 + b^2}$$

Donde:
* $a$: longitud del semieje transverso.
* $b$: longitud del semieje conjugado (o imaginario).
* $c$: distancia semifocal (distancia desde el centro $C$ a cualquiera de los focos $F$).
* Puesto que $a > 0$ y $b > 0$, se verifica que $c > a > 0$, lo que garantiza que la excentricidad $e = \frac{c}{a} > 1$.

---

### 1.3 Ecuaciones Canónicas

#### 1.3.1 Hipérbola Horizontal (Eje focal paralelo o coincidente con el eje X)
Con centro en $C(h, k)$:

$$\frac{(x - h)^2}{a^2} - \frac{(y - k)^2}{b^2} = 1$$

* Los vértices y focos se ubican sobre la recta horizontal $y = k$.
* Las ramas se abren horizontalmente hacia la izquierda y hacia la derecha.

#### 1.3.2 Hipérbola Vertical (Eje focal paralelo o coincidente con el eje Y)
Con centro en $C(h, k)$:

$$\frac{(y - k)^2}{a^2} - \frac{(x - h)^2}{b^2} = 1$$

* Los vértices y focos se ubican sobre la recta vertical $x = h$.
* Las ramas se abren verticalmente hacia arriba y hacia abajo.

---

### 1.4 Elementos Notables

| Elemento | Hipérbola Horizontal | Hipérbola Vertical |
| :--- | :--- | :--- |
| **Centro** | $C(h, k)$ | $C(h, k)$ |
| **Vértices** | $V_1(h - a, k), \quad V_2(h + a, k)$ | $V_1(h, k - a), \quad V_2(h, k + a)$ |
| **Focos** | $F_1(h - c, k), \quad F_2(h + c, k)$ | $F_1(h, k - c), \quad F_2(h, k + c)$ |
| **Longitud Eje Transverso** | $2a$ | $2a$ |
| **Longitud Eje Conjugado** | $2b$ | $2b$ |
| **Distancia Focal** | $2c = 2\sqrt{a^2 + b^2}$ | $2c = 2\sqrt{a^2 + b^2}$ |
| **Excentricidad** | $e = \frac{c}{a} > 1$ | $e = \frac{c}{a} > 1$ |
| **Lado Recto (LR)** | $LR = \frac{2b^2}{a}$ | $LR = \frac{2b^2}{a}$ |

---

### 1.5 Deducción de las Asíntotas
Las asíntotas son rectas tangentes a la curva en el infinito que determinan el comportamiento asintótico de las ramas.

Partiendo de la forma horizontal canónica $\frac{(x - h)^2}{a^2} - \frac{(y - k)^2}{b^2} = 1$:
1. Despejando $(y - k)$:
   $$\frac{(y - k)^2}{b^2} = \frac{(x - h)^2}{a^2} - 1 = \frac{(x - h)^2}{a^2} \left(1 - \frac{a^2}{(x - h)^2}\right)$$
   $$y - k = \pm \frac{b}{a} (x - h) \sqrt{1 - \frac{a^2}{(x - h)^2}}$$

2. Tomando el límite cuando $x \to \pm \infty$:
   $$\lim_{x \to \pm \infty} \sqrt{1 - \frac{a^2}{(x - h)^2}} = 1$$

3. Obtenemos las rectas asíntotas:
   * **Horizontal:**
     $$y - k = \pm \frac{b}{a}(x - h) \implies y = k \pm \frac{b}{a}(x - h)$$
   * **Vertical:**
     $$y - k = \pm \frac{a}{b}(x - h) \implies y = k \pm \frac{a}{b}(x - h)$$

El motor matemático utiliza la biblioteca `math.js` para simplificar las fracciones $b/a$ y $a/b$ a su mínima expresión irreducible (por ejemplo, $\frac{16}{12} \implies \frac{4}{3}$).

---

### 1.6 El Rectángulo Fundamental ("Rectángulo Mágico")
Es el rectángulo auxiliar centrado en $C(h, k)$ utilizado en geometría analítica para graficar con precisión las asíntotas y las ramas:
* **Hipérbola Horizontal:**
  * Base: $2a$ (extendiéndose de $h - a$ a $h + a$).
  * Altura: $2b$ (extendiéndose de $k - b$ a $k + b$).
  * Esquinas: $(h \pm a, k \pm b)$.
* **Hipérbola Vertical:**
  * Base: $2b$ (extendiéndose de $h - b$ a $h + b$).
  * Altura: $2a$ (extendiéndose de $k - a$ a $k + a$).
  * Esquinas: $(h \pm b, k \pm a)$.

**Propiedad clave:** Las diagonales completas del rectángulo coinciden exactamente con las rectas asíntotas de la hipérbola.

---

### 1.7 Conversión a Ecuación General
La ecuación general de una sección cónica con ejes paralelos a los ejes coordenados tiene la forma:

$$Ax^2 + Cy^2 + Dx + Ey + F = 0$$

Para que represente una hipérbola válida, los coeficientes cuadráticos deben tener signos opuestos:
$$A \cdot C < 0$$

#### Deducción para Hipérbola Horizontal:
$$b^2(x - h)^2 - a^2(y - k)^2 = a^2b^2$$
$$b^2(x^2 - 2hx + h^2) - a^2(y^2 - 2ky + k^2) - a^2b^2 = 0$$
Agrupando términos:
* $A = b^2$
* $C = -a^2$
* $D = -2 b^2 h$
* $E = 2 a^2 k$
* $F = b^2 h^2 - a^2 k^2 - a^2 b^2$

#### Deducción para Hipérbola Vertical:
$$-a^2(x - h)^2 + b^2(y - k)^2 = a^2b^2$$
* $A = -a^2$
* $C = b^2$
* $D = 2 a^2 h$
* $E = -2 b^2 k$
* $F = -a^2 h^2 + b^2 k^2 - a^2 b^2$

---

### 1.8 Parametrización por Funciones Hiperbólicas
Para dibujar las curvas en HTML5 Canvas con alta fidelidad y sin singularidades en las derivadas verticales, se utiliza la parametrización de funciones hiperbólicas basada en la identidad fundamental $\cosh^2(t) - \sinh^2(t) = 1$:

* **Hipérbola Horizontal:**
  $$\begin{cases}
  x(t) = h \pm a \cosh(t) \\
  y(t) = k + b \sinh(t)
  \end{cases} \quad t \in [-t_{\max}, t_{\max}]$$
  * El signo $+$ genera la rama derecha ($x \ge h + a$).
  * El signo $-$ genera la rama izquierda ($x \le h - a$).

* **Hipérbola Vertical:**
  $$\begin{cases}
  x(t) = h + b \sinh(t) \\
  y(t) = k \pm a \cosh(t)
  \end{cases} \quad t \in [-t_{\max}, t_{\max}]$$
  * El signo $+$ genera la rama superior ($y \ge k + a$).
  * El signo $-$ genera la rama inferior ($y \le k - a$).

---

## 2. Arquitectura del Software (Clean Architecture)

### 2.1 Principios de Diseño Hexagonal
Siguiendo las directrices de `.agents` (`rf-hiperbola-review.md` y `SKILL.md`):
1. **Aislamiento del Dominio:** El motor en `src/domain/math/` contiene lógica matemática pura. No importa objetos del DOM (`window`, `document`), ni elementos `<canvas>`, ni librerías de interfaz.
2. **Programación Funcional:** Cada función de cálculo es pura: recibe parámetros inmutables y retorna estructuras de datos congeladas (`Object.freeze`). No existen estados globales mutables.
3. **Adaptadores Desacoplados:** La interfaz gráfica (`src/adapters/ui/`) y el renderizador (`src/adapters/canvas/`) actúan como adaptadores consumidores del núcleo matemático.

```text
                  +-----------------------------------+
                  |           UI / Inputs             |
                  |    (Controlador de Eventos)       |
                  +-----------------+-----------------+
                                    |
                                    v
+------------------+     +--------------------+     +-------------------+
|  Canvas Adapter  |<----+    Domain Math     +---->| Formatter Adapter |
| (Renderizado 2D) |     |  (hyperbolaEngine) |     | (Ecuaciones LaTeX)|
+------------------+     +--------------------+     +-------------------+
```

### 2.2 Estructura de Directorios

```text
hiperbola-app/
├── index.html                 # Punto de entrada HTML5
├── package.json               # Dependencias (mathjs, tailwindcss, vite)
├── vite.config.js             # Configuración de Vite con plugin Anti-DDoS
├── tailwind.config.js         # Configuración del modo oscuro y paleta
├── postcss.config.js          # Pipeline de PostCSS
├── README.md                  # Guía de usuario y ejecución rápida
├── DOCUMENTACION.md           # Documentación técnica y matemática completa
├── test/
│   ├── hyperbolaEngine.test.js # Tests matemáticos unitarios
│   └── antiDdos.test.js       # Tests de seguridad y rate limiting
└── src/
    ├── domain/
    │   └── math/
    │       ├── constants.js       # Constantes matemáticas y de configuración
    │       ├── equationParser.js  # Parser de cadenas de texto canónicas
    │       └── hyperbolaEngine.js # Motor de cálculo analítico puro
    ├── adapters/
    │   ├── ui/                    # Adaptadores de presentación e interacción
    │   └── canvas/                # Adaptadores de gráficos 2D interactivos
    ├── components/
    │   ├── UIControls.js          # Componente de interfaz de usuario
    │   └── GraphCanvas.js         # Componente de canvas con pan & zoom
    ├── utils/
    │   └── formatters.js          # Formateadores algebraicos
    ├── main.js                    # Inyector de dependencias / Orquestador
    └── style.css                  # Estilos globales y utilidades
```

### 2.3 Motor Matemático Puro (`hyperbolaEngine.js`)
Exporta las siguientes funciones de dominio:
* `validateHyperbolaParameters(params)`: Comprueba tipos numéricos y precondiciones ($a > 0$, $b > 0$).
* `calculateFocalDistance(a, b)`: Calcula $c = \sqrt{a^2 + b^2}$ y $c^2$.
* `calculateVertices(h, k, a, orientation)`: Vértices $V_1, V_2$.
* `calculateFoci(h, k, c, orientation)`: Focos $F_1, F_2$.
* `calculateAsymptotes(h, k, a, b, orientation)`: Genera pendientes numéricas, fracciones exactas y funciones evaluadoras.
* `calculateReferenceRectangle(h, k, a, b, orientation)`: Dimensiones y 4 esquinas del rectángulo fundamental.
* `verifyDistanceDifference(point, foci, a)`: Evalúa el invariante geométrico $|d(P, F_1) - d(P, F_2)| = 2a$.
* `generateHyperbolaBranches(h, k, a, b, orientation, maxT, numPoints)`: Genera coordenadas para ambas ramas.
* `calculateHyperbola(params)`: Orquestador funcional principal.

### 2.4 Parser de Ecuaciones Canónicas (`equationParser.js`)
Reconoce expresiones canónicas introducidas por el usuario mediante expresiones regulares normalizadas:
* Formatos reconocidos:
  * `x^2/9 - y^2/16 = 1`
  * `x²/9 - y²/16 = 1`
  * `(x - 2)^2/9 - (y + 1)^2/16 = 1`
  * `(y - 3)^2/25 - (x + 1)^2/4 = 1`
* Extrae de forma determinista: $a$, $b$, $h$, $k$ y la orientación correspondiente.

---

## 3. Sistema de Seguridad y Mitigación Anti-DDoS

Ubicado en [src/security/antiDdos.js](file:///home/pablomontero/Documentos/Hyperbola/hiperbola-app/src/security/antiDdos.js).

### 3.1 Algoritmo de Ventana Deslizante (Sliding Window)
El sistema rastrea el tráfico entrante a nivel de Capa 7 (HTTP) agrupado por dirección IP del cliente (extrayendo `X-Forwarded-For`, `X-Real-IP` o `socket.remoteAddress`).

1. Para cada petición entrante se consulta la tupla `{ count, windowStart, bannedUntil }`.
2. Si el tiempo actual ha superado la ventana `windowMs` (10 segundos), el contador se reinicia.
3. Si el tráfico excede `maxRequests` dentro de la ventana, se rechaza la petición.

### 3.2 Política de Auto-Ban y Rate Limiting
* **Límite Suave (Rate Limit):** Si una IP excede 50 peticiones en 10 segundos, se responde con código HTTP `429 Too Many Requests`.
* **Límite Duro (Ataque DoS / Flood):** Si una IP supera las 100 peticiones en la misma ventana, se clasifica como tráfico malicioso y se activa un **Baneo Temporal** por 60 segundos (`403 Forbidden`).

### 3.3 Headers y Respuestas HTTP
* En solicitudes válidas:
  * `X-RateLimit-Limit: 50`
  * `X-RateLimit-Remaining: <restantes>`
* En solicitudes bloqueadas (HTTP 429 / 403):
  * `Retry-After: <segundos_para_desbloqueo>`
  * Cuerpo JSON descriptivo con el motivo de bloqueo.

---

## 4. Protocolo y Suite de Pruebas Unitarias

### 4.1 Cobertura de Casos Obligatorios

| Identificador | Caso de Prueba | Entrada | Salida Esperada |
| :--- | :--- | :--- | :--- |
| **Test 1** | Hipérbola Canónica Clásica | `x^2/9 - y^2/16 = 1` | $a=3, b=4 \implies c=5$. Focos: $(\pm 5, 0)$. Vértices: $(\pm 3, 0)$. Asíntotas: $y = \pm \frac{4}{3}x$. |
| **Test 2** | Traslación del Centro | `(x - 2)^2/9 - (y + 1)^2/16 = 1` | Centro: $(2, -1)$. Focos: $(-3, -1)$ y $(7, -1)$. Vértices: $(-1, -1)$ y $(5, -1)$. Rectángulo de $6 \times 8$. |
| **Test 3** | Invariante Focal $\|PF_1 - PF_2\| = 2a$ | Muestreo de 302 puntos a lo largo de las dos ramas | Diferencia absoluta $\|d_1 - d_2\| = 6$ verificada con error $< 10^{-4}$. |
| **Test 4** | Hipérbola Vertical | $a=4, b=3, C(1, 2)$, orientación vertical | $c=5$. Vértices: $(1, -2)$ y $(1, 6)$. Focos: $(1, -3)$ y $(1, 7)$. Asíntota: $m = 4/3$. |
| **Test 5** | Límites y Robustez | $a \le 0$, $b \le 0$, $h = \text{NaN}$ | Lanzamiento estricto de `RangeError` y `TypeError`. |
| **Test 6** | Sistema Anti-DDoS | Ráfagas de 5, 6 y 11 peticiones | 1-5 permitidas, 6 retorna 429, flood activa baneo 403 con `Retry-After`. |

### 4.2 Ejecución y Resultados

```bash
cd hiperbola-app
npm test
```

Salida de la terminal:
```text
> hiperbola-app@1.0.0 test
> node test/hyperbolaEngine.test.js && node test/antiDdos.test.js

--- INICIANDO SUITE DE PRUEBAS DEL MOTOR MATEMÁTICO ---

[Test 1] Evaluando x²/9 - y²/16 = 1...
✓ Test 1 superado con éxito.

[Test 2] Comprobando traslación de centro a (2, -1)...
✓ Test 2 superado con éxito.

[Test 3] Verificando definición geométrica |PF1 - PF2| = 2a...
✓ Test 3 superado con éxito (302 puntos validados).

[Test 4] Verificando hipérbola con orientación vertical...
✓ Test 4 superado con éxito.

[Test 5] Validando manejo de errores y precondiciones...
✓ Test 5 superado con éxito.

======================================================
¡TODAS LAS PRUEBAS MATEMÁTICAS FUERON SUPERADAS AL 100%!
======================================================

--- TEST: SISTEMA ANTI-DDOS / RATE LIMITING ---
✓ 429 Too Many Requests verificado al superar el umbral.
✓ 403 Forbidden (Auto-Ban) activado correctamente tras flood.
✓ Whitelist verificada sin bloqueos.

¡TODAS LAS PRUEBAS DEL ANTI-DDOS COMPLETADAS CON ÉXITO!
```
