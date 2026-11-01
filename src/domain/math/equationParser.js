import { ORIENTATION_HORIZONTAL, ORIENTATION_VERTICAL } from './constants.js';

/**
 * Parsea una ecuación canónica de hipérbola introducida por el usuario como texto.
 * Ejemplos admitidos:
 *   - "x^2/9 - y^2/16 = 1" o "x²/9 - y²/16 = 1"
 *   - "(x - 2)^2 / 9 - (y + 1)^2 / 16 = 1"
 *   - "(y - 3)^2 / 25 - (x + 1)^2 / 4 = 1"
 */
export function parseCanonicalEquation(rawInput) {
  if (typeof rawInput !== 'string') {
    throw new TypeError('La entrada de la ecuación debe ser una cadena de texto.');
  }

  // Normalizar cadena: quitar espacios, convertir potencias unicode ² a ^2
  const cleaned = rawInput
    .replace(/\s+/g, '')
    .replace(/²/g, '^2');

  // Verificar que esté igualada a 1
  if (!cleaned.endsWith('=1')) {
    throw new Error('La ecuación debe estar igualada a 1 (ej: x^2/9 - y^2/16 = 1).');
  }

  const leftSide = cleaned.slice(0, -2); // quitar '=1'

  // Regex para término desplazado o simple:
  // (x-h)^2/a2  o  x^2/a2
  const termRegex = /^(\((x|y)([+-]\d+(?:\.\d+)?)\)\^2|(x|y)\^2)\/(\d+(?:\.\d+)?)-(\((x|y)([+-]\d+(?:\.\d+)?)\)\^2|(x|y)\^2)\/(\d+(?:\.\d+)?)$/i;

  const match = leftSide.match(termRegex);
  if (!match) {
    throw new Error('Formato no reconocido. Usa formato canónico como: (x-h)^2/a^2 - (y-k)^2/b^2 = 1');
  }

  // Termino 1
  const var1 = (match[2] || match[4]).toLowerCase();
  const shift1Str = match[3];
  const denom1 = parseFloat(match[5]);

  // Termino 2
  const var2 = (match[7] || match[9]).toLowerCase();
  const shift2Str = match[8];
  const denom2 = parseFloat(match[10]);

  if (var1 === var2) {
    throw new Error('La ecuación no puede tener la misma variable en ambos términos.');
  }

  if (denom1 <= 0 || denom2 <= 0) {
    throw new Error('Los denominadores a² y b² deben ser mayores que cero.');
  }

  let centerX = 0;
  let centerY = 0;
  let semiTransverseA = Math.sqrt(denom1);
  let semiConjugateB = Math.sqrt(denom2);
  let orientation = ORIENTATION_HORIZONTAL;

  if (var1 === 'x') {
    orientation = ORIENTATION_HORIZONTAL;
    // Si (x - h), entonces x - 2 significa h = +2. Si x + 2, h = -2.
    if (shift1Str) {
      centerX = -parseFloat(shift1Str);
    }
    if (shift2Str) {
      centerY = -parseFloat(shift2Str);
    }
  } else if (var1 === 'y') {
    orientation = ORIENTATION_VERTICAL;
    if (shift1Str) {
      centerY = -parseFloat(shift1Str);
    }
    if (shift2Str) {
      centerX = -parseFloat(shift2Str);
    }
  }

  return {
    semiTransverseA,
    semiConjugateB,
    centerX,
    centerY,
    orientation
  };
}
