import { fraction, sqrt, format } from 'mathjs';
import {
  ORIENTATION_HORIZONTAL,
  ORIENTATION_VERTICAL,
  MIN_AXIS_VALUE,
  DEFAULT_NUM_BRANCH_POINTS,
  EPSILON
} from './constants.js';

/**
 * Valida los parámetros geométricos de una hipérbola.
 * Lanza errores específicos si las precondiciones no se cumplen.
 */
export function validateHyperbolaParameters({ semiTransverseA, semiConjugateB, centerX, centerY, orientation }) {
  if (typeof centerX !== 'number' || !Number.isFinite(centerX)) {
    throw new TypeError('El centro h (centerX) debe ser un número finito.');
  }
  if (typeof centerY !== 'number' || !Number.isFinite(centerY)) {
    throw new TypeError('El centro k (centerY) debe ser un número finito.');
  }
  if (typeof semiTransverseA !== 'number' || !Number.isFinite(semiTransverseA) || semiTransverseA <= MIN_AXIS_VALUE) {
    throw new RangeError('El semieje transverso (a) debe ser un número estrictamente mayor que cero.');
  }
  if (typeof semiConjugateB !== 'number' || !Number.isFinite(semiConjugateB) || semiConjugateB <= MIN_AXIS_VALUE) {
    throw new RangeError('El semieje conjugado (b) debe ser un número estrictamente mayor que cero.');
  }
  if (orientation !== ORIENTATION_HORIZONTAL && orientation !== ORIENTATION_VERTICAL) {
    throw new ValueError(`La orientación debe ser '${ORIENTATION_HORIZONTAL}' o '${ORIENTATION_VERTICAL}'.`);
  }
  return true;
}

/**
 * Calcula la distancia focal c aplicando estrictamente c² = a² + b²
 */
export function calculateFocalDistance(semiTransverseA, semiConjugateB) {
  const cSquared = semiTransverseA * semiTransverseA + semiConjugateB * semiConjugateB;
  const c = Math.sqrt(cSquared);
  return { c, cSquared };
}

/**
 * Calcula los vértices de la hipérbola.
 */
export function calculateVertices(centerX, centerY, semiTransverseA, orientation) {
  if (orientation === ORIENTATION_HORIZONTAL) {
    return {
      v1: { x: centerX - semiTransverseA, y: centerY },
      v2: { x: centerX + semiTransverseA, y: centerY }
    };
  }
  return {
    v1: { x: centerX, y: centerY - semiTransverseA },
    v2: { x: centerX, y: centerY + semiTransverseA }
  };
}

/**
 * Calcula los focos de la hipérbola usando c = sqrt(a² + b²)
 */
export function calculateFoci(centerX, centerY, focalC, orientation) {
  if (orientation === ORIENTATION_HORIZONTAL) {
    return {
      f1: { x: centerX - focalC, y: centerY },
      f2: { x: centerX + focalC, y: centerY }
    };
  }
  return {
    f1: { x: centerX, y: centerY - focalC },
    f2: { x: centerX, y: centerY + focalC }
  };
}

/**
 * Calcula las asíntotas con representación en fracción exacta usando math.js
 * y funciones de evaluación pura para cualquier x.
 */
export function calculateAsymptotes(centerX, centerY, semiTransverseA, semiConjugateB, orientation) {
  // Evitar división por cero
  if (semiTransverseA <= 0 || semiConjugateB <= 0) {
    throw new RangeError('Los semiejes deben ser positivos para calcular las asíntotas.');
  }

  // Pendiente en valor absoluto
  const numSlope = orientation === ORIENTATION_HORIZONTAL
    ? semiConjugateB / semiTransverseA
    : semiTransverseA / semiConjugateB;

  // Fracción irreducible usando mathjs
  const fracSlope = orientation === ORIENTATION_HORIZONTAL
    ? fraction(semiConjugateB, semiTransverseA)
    : fraction(semiTransverseA, semiConjugateB);

  const slopeFractionString = fracSlope.d === 1 ? `${fracSlope.s * fracSlope.n}` : `${fracSlope.s * fracSlope.n}/${fracSlope.d}`;

  return {
    slopeValue: numSlope,
    slopeFractionString,
    // y = k ± m * (x - h)
    evaluatePositive: (x) => centerY + numSlope * (x - centerX),
    evaluateNegative: (x) => centerY - numSlope * (x - centerX)
  };
}

/**
 * Calcula el rectángulo de referencia ("rectángulo mágico").
 * Sus diagonales coinciden con las asíntotas.
 */
export function calculateReferenceRectangle(centerX, centerY, semiTransverseA, semiConjugateB, orientation) {
  let halfWidth;
  let halfHeight;

  if (orientation === ORIENTATION_HORIZONTAL) {
    halfWidth = semiTransverseA;
    halfHeight = semiConjugateB;
  } else {
    halfWidth = semiConjugateB;
    halfHeight = semiTransverseA;
  }

  return {
    centerX,
    centerY,
    width: 2 * halfWidth,
    height: 2 * halfHeight,
    halfWidth,
    halfHeight,
    topLeft: { x: centerX - halfWidth, y: centerY + halfHeight },
    topRight: { x: centerX + halfWidth, y: centerY + halfHeight },
    bottomRight: { x: centerX + halfWidth, y: centerY - halfHeight },
    bottomLeft: { x: centerX - halfWidth, y: centerY - halfHeight }
  };
}

/**
 * Valida la definición geométrica fundamental: |PF1 - PF2| = 2a
 * para cualquier punto P sobre la hipérbola.
 */
export function verifyDistanceDifference(point, foci, semiTransverseA) {
  const d1 = Math.hypot(point.x - foci.f1.x, point.y - foci.f1.y);
  const d2 = Math.hypot(point.x - foci.f2.x, point.y - foci.f2.y);
  const difference = Math.abs(d1 - d2);
  const expectedDifference = 2 * semiTransverseA;
  const isSatisfied = Math.abs(difference - expectedDifference) < 1e-4;

  return {
    d1,
    d2,
    difference,
    expectedDifference,
    isSatisfied
  };
}

/**
 * Genera puntos de ambas ramas de la curva hiperbólica usando parametrización hiperbólica
 * x(t) = h ± a cosh(t), y(t) = k + b sinh(t) (horizontal) para máxima estabilidad numérica.
 */
export function generateHyperbolaBranches(centerX, centerY, semiTransverseA, semiConjugateB, orientation, maxT = 2.5, numPoints = DEFAULT_NUM_BRANCH_POINTS) {
  const branch1 = [];
  const branch2 = [];

  const step = (2 * maxT) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const t = -maxT + i * step;
    const coshT = Math.cosh(t);
    const sinhT = Math.sinh(t);

    if (orientation === ORIENTATION_HORIZONTAL) {
      // Rama derecha (x > h)
      branch1.push({
        x: centerX + semiTransverseA * coshT,
        y: centerY + semiConjugateB * sinhT
      });
      // Rama izquierda (x < h)
      branch2.push({
        x: centerX - semiTransverseA * coshT,
        y: centerY + semiConjugateB * sinhT
      });
    } else {
      // Rama superior (y > k)
      branch1.push({
        x: centerX + semiConjugateB * sinhT,
        y: centerY + semiTransverseA * coshT
      });
      // Rama inferior (y < k)
      branch2.push({
        x: centerX + semiConjugateB * sinhT,
        y: centerY - semiTransverseA * coshT
      });
    }
  }

  return { branch1, branch2 };
}

/**
 * Orquestador funcional del dominio matemático puro:
 * Recibe los parámetros de entrada y devuelve el objeto inmutable con todas
 * las propiedades analíticas calculadas.
 */
export function calculateHyperbola(params) {
  validateHyperbolaParameters(params);

  const {
    semiTransverseA,
    semiConjugateB,
    centerX,
    centerY,
    orientation = ORIENTATION_HORIZONTAL
  } = params;

  const { c, cSquared } = calculateFocalDistance(semiTransverseA, semiConjugateB);
  const eccentricity = c / semiTransverseA;
  const latusRectum = (2 * (semiConjugateB * semiConjugateB)) / semiTransverseA;
  const constantDifference = 2 * semiTransverseA;

  const center = Object.freeze({ x: centerX, y: centerY });
  const vertices = Object.freeze(calculateVertices(centerX, centerY, semiTransverseA, orientation));
  const foci = Object.freeze(calculateFoci(centerX, centerY, c, orientation));
  const asymptotes = Object.freeze(calculateAsymptotes(centerX, centerY, semiTransverseA, semiConjugateB, orientation));
  const referenceRectangle = Object.freeze(calculateReferenceRectangle(centerX, centerY, semiTransverseA, semiConjugateB, orientation));
  const branches = Object.freeze(generateHyperbolaBranches(centerX, centerY, semiTransverseA, semiConjugateB, orientation));

  return Object.freeze({
    parameters: Object.freeze({ semiTransverseA, semiConjugateB, centerX, centerY, orientation }),
    center,
    focalDistanceC: c,
    focalDistanceCSquared: cSquared,
    eccentricity,
    latusRectum,
    constantDifference,
    vertices,
    foci,
    asymptotes,
    referenceRectangle,
    branches
  });
}
