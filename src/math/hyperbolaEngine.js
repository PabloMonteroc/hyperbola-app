export function validateHyperbolaParams({ h, k, a, b, orientation }) {
  if (typeof h !== 'number' || !Number.isFinite(h)) {
    throw new Error('El valor de h debe ser un número finito.');
  }
  if (typeof k !== 'number' || !Number.isFinite(k)) {
    throw new Error('El valor de k debe ser un número finito.');
  }
  if (typeof a !== 'number' || !Number.isFinite(a) || a <= 0) {
    throw new Error('El semieje transverso (a) debe ser mayor que cero.');
  }
  if (typeof b !== 'number' || !Number.isFinite(b) || b <= 0) {
    throw new Error('El semieje conjugado (b) debe ser mayor que cero.');
  }
  if (orientation !== 'horizontal' && orientation !== 'vertical') {
    throw new Error("La orientación debe ser 'horizontal' o 'vertical'.");
  }
  return true;
}

export function computeHyperbola(params) {
  validateHyperbolaParams(params);

  const { h, k, a, b, orientation } = params;

  // Relación fundamental: c² = a² + b²
  const cSquared = a * a + b * b;
  const c = Math.sqrt(cSquared);
  const eccentricity = c / a;
  const latusRectum = (2 * b * b) / a;

  const center = { x: h, y: k };

  let v1, v2, f1, f2;
  let asymptoteSlope;
  let rectangle;
  let generalForm;

  if (orientation === 'horizontal') {
    // Vértices y focos sobre el eje y = k
    v1 = { x: h - a, y: k };
    v2 = { x: h + a, y: k };
    f1 = { x: h - c, y: k };
    f2 = { x: h + c, y: k };

    // Pendiente de las asíntotas: m = ± (b / a)
    asymptoteSlope = b / a;

    // Rectángulo auxiliar centrado en (h, k) con ancho 2a y alto 2b
    rectangle = {
      x: h - a,
      y: k - b,
      width: 2 * a,
      height: 2 * b,
      corners: [
        { x: h - a, y: k - b },
        { x: h + a, y: k - b },
        { x: h + a, y: k + b },
        { x: h - a, y: k + b }
      ]
    };

    // Forma general: Ax² + Cy² + Dx + Ey + F = 0
    // b²(x-h)² - a²(y-k)² - a²b² = 0
    const A = b * b;
    const C = -(a * a);
    const D = -2 * b * b * h;
    const E = 2 * a * a * k;
    const F = b * b * h * h - a * a * k * k - a * a * b * b;

    generalForm = { A, C, D, E, F };
  } else {
    // Vértices y focos sobre el eje x = h
    v1 = { x: h, y: k - a };
    v2 = { x: h, y: k + a };
    f1 = { x: h, y: k - c };
    f2 = { x: h, y: k + c };

    // Pendiente de las asíntotas: m = ± (a / b)
    asymptoteSlope = a / b;

    // Rectángulo auxiliar centrado en (h, k) con ancho 2b y alto 2a
    rectangle = {
      x: h - b,
      y: k - a,
      width: 2 * b,
      height: 2 * a,
      corners: [
        { x: h - b, y: k - a },
        { x: h + b, y: k - a },
        { x: h + b, y: k + a },
        { x: h - b, y: k + a }
      ]
    };

    // Forma general: -a²(x-h)² + b²(y-k)² - a²b² = 0
    const A = -(a * a);
    const C = b * b;
    const D = 2 * a * a * h;
    const E = -2 * b * b * k;
    const F = -(a * a * h * h) + b * b * k * k - a * a * b * b;

    generalForm = { A, C, D, E, F };
  }

  return {
    h,
    k,
    a,
    b,
    c,
    cSquared,
    eccentricity,
    latusRectum,
    orientation,
    center,
    vertices: { v1, v2 },
    foci: { f1, f2 },
    asymptotes: {
      slope: asymptoteSlope,
      // y - k = ± slope * (x - h)
      evaluate: (x, sign = 1) => k + sign * asymptoteSlope * (x - h)
    },
    rectangle,
    generalForm
  };
}
