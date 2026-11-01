import assert from 'node:assert/strict';
import {
  calculateHyperbola,
  verifyDistanceDifference,
  validateHyperbolaParameters
} from '../src/domain/math/hyperbolaEngine.js';
import { parseCanonicalEquation } from '../src/domain/math/equationParser.js';
import {
  ORIENTATION_HORIZONTAL,
  ORIENTATION_VERTICAL
} from '../src/domain/math/constants.js';

console.log('--- INICIANDO SUITE DE PRUEBAS DEL MOTOR MATEMÁTICO ---');

// ==========================================
// TEST 1: Hipérbola canónica x²/9 - y²/16 = 1
// ==========================================
console.log('\n[Test 1] Evaluando x²/9 - y²/16 = 1...');
const parsed1 = parseCanonicalEquation('x^2/9 - y^2/16 = 1');
assert.equal(parsed1.semiTransverseA, 3, 'a debe ser 3');
assert.equal(parsed1.semiConjugateB, 4, 'b debe ser 4');
assert.equal(parsed1.centerX, 0, 'h debe ser 0');
assert.equal(parsed1.centerY, 0, 'k debe ser 0');
assert.equal(parsed1.orientation, ORIENTATION_HORIZONTAL, 'orientación horizontal');

const result1 = calculateHyperbola(parsed1);

// Fórmulas estrictas: c² = a² + b² = 9 + 16 = 25 -> c = 5
assert.equal(result1.focalDistanceCSquared, 25, 'c² debe ser exactamente 25');
assert.equal(result1.focalDistanceC, 5, 'c debe ser exactamente 5');

// Focos en (±5, 0)
assert.deepEqual(result1.foci.f1, { x: -5, y: 0 }, 'Foco 1 debe ser (-5, 0)');
assert.deepEqual(result1.foci.f2, { x: 5, y: 0 }, 'Foco 2 debe ser (5, 0)');

// Vértices en (±3, 0)
assert.deepEqual(result1.vertices.v1, { x: -3, y: 0 }, 'Vértice 1 debe ser (-3, 0)');
assert.deepEqual(result1.vertices.v2, { x: 3, y: 0 }, 'Vértice 2 debe ser (3, 0)');

// Asíntotas: y = ±(4/3)x
assert.equal(result1.asymptotes.slopeFractionString, '4/3', 'Pendiente de asíntota debe ser 4/3');
assert.equal(result1.asymptotes.evaluatePositive(3), 4, 'Asíntota positiva en x=3 debe valer 4');
assert.equal(result1.asymptotes.evaluateNegative(3), -4, 'Asíntota negativa en x=3 debe valer -4');
console.log('✓ Test 1 superado con éxito.');

// ==========================================
// TEST 2: Traslación del centro a (2, -1)
// ==========================================
console.log('\n[Test 2] Comprobando traslación de centro a (2, -1)...');
const parsed2 = parseCanonicalEquation('(x - 2)^2/9 - (y + 1)^2/16 = 1');
assert.equal(parsed2.centerX, 2, 'Centro h debe ser 2');
assert.equal(parsed2.centerY, -1, 'Centro k debe ser -1');

const result2 = calculateHyperbola(parsed2);
assert.deepEqual(result2.center, { x: 2, y: -1 }, 'Centro debe ser (2, -1)');
assert.deepEqual(result2.foci.f1, { x: 2 - 5, y: -1 }, 'Foco 1 traslación correcta: (-3, -1)');
assert.deepEqual(result2.foci.f2, { x: 2 + 5, y: -1 }, 'Foco 2 traslación correcta: (7, -1)');
assert.deepEqual(result2.vertices.v1, { x: 2 - 3, y: -1 }, 'Vértice 1 traslación correcta: (-1, -1)');
assert.deepEqual(result2.vertices.v2, { x: 2 + 3, y: -1 }, 'Vértice 2 traslación correcta: (5, -1)');

// Rectángulo auxiliar centrado en (2, -1)
assert.equal(result2.referenceRectangle.width, 6, 'Ancho del rectángulo debe ser 2a = 6');
assert.equal(result2.referenceRectangle.height, 8, 'Alto del rectángulo debe ser 2b = 8');
console.log('✓ Test 2 superado con éxito.');

// ==========================================
// TEST 3: Diferencia de distancias constante |PF1 - PF2| = 2a
// ==========================================
console.log('\n[Test 3] Verificando definición geométrica |PF1 - PF2| = 2a...');
// Para la hipérbola x²/9 - y²/16 = 1, 2a = 6
// Probemos con el vértice derecho (3, 0)
const vertexPoint = result1.vertices.v2;
const checkVertex = verifyDistanceDifference(vertexPoint, result1.foci, result1.parameters.semiTransverseA);
assert.equal(checkVertex.isSatisfied, true, 'El vértice debe cumplir |PF1 - PF2| = 2a');
assert.equal(Math.round(checkVertex.difference), 6, 'Diferencia en el vértice debe ser exactamente 6');

// Probemos con puntos generados a lo largo de las ramas (cosh(t), sinh(t))
for (const p of result1.branches.branch1) {
  const checkBranch = verifyDistanceDifference(p, result1.foci, result1.parameters.semiTransverseA);
  assert.equal(checkBranch.isSatisfied, true, `Punto (${p.x.toFixed(2)}, ${p.y.toFixed(2)}) debe cumplir |PF1 - PF2| = 2a`);
}
for (const p of result1.branches.branch2) {
  const checkBranch = verifyDistanceDifference(p, result1.foci, result1.parameters.semiTransverseA);
  assert.equal(checkBranch.isSatisfied, true, `Punto (${p.x.toFixed(2)}, ${p.y.toFixed(2)}) debe cumplir |PF1 - PF2| = 2a`);
}
console.log(`✓ Test 3 superado con éxito (${result1.branches.branch1.length + result1.branches.branch2.length} puntos validados).`);

// ==========================================
// TEST 4: Hipérbola vertical (y - k)²/a² - (x - h)²/b² = 1
// ==========================================
console.log('\n[Test 4] Verificando hipérbola con orientación vertical...');
const verticalParams = {
  semiTransverseA: 4,
  semiConjugateB: 3,
  centerX: 1,
  centerY: 2,
  orientation: ORIENTATION_VERTICAL
};
const resultVertical = calculateHyperbola(verticalParams);
assert.equal(resultVertical.focalDistanceC, 5, 'c debe ser 5');
assert.deepEqual(resultVertical.vertices.v1, { x: 1, y: 2 - 4 }, 'Vértice 1 en vertical (1, -2)');
assert.deepEqual(resultVertical.vertices.v2, { x: 1, y: 2 + 4 }, 'Vértice 2 en vertical (1, 6)');
assert.deepEqual(resultVertical.foci.f1, { x: 1, y: 2 - 5 }, 'Foco 1 en vertical (1, -3)');
assert.deepEqual(resultVertical.foci.f2, { x: 1, y: 2 + 5 }, 'Foco 2 en vertical (1, 7)');
assert.equal(resultVertical.asymptotes.slopeFractionString, '4/3', 'Pendiente vertical m = a/b = 4/3');
console.log('✓ Test 4 superado con éxito.');

// ==========================================
// TEST 5: Validaciones de robustez y límites
// ==========================================
console.log('\n[Test 5] Validando manejo de errores y precondiciones...');
assert.throws(() => {
  validateHyperbolaParameters({ semiTransverseA: -2, semiConjugateB: 3, centerX: 0, centerY: 0, orientation: ORIENTATION_HORIZONTAL });
}, RangeError, 'Debe lanzar RangeError si a <= 0');

assert.throws(() => {
  validateHyperbolaParameters({ semiTransverseA: 2, semiConjugateB: 0, centerX: 0, centerY: 0, orientation: ORIENTATION_HORIZONTAL });
}, RangeError, 'Debe lanzar RangeError si b <= 0');

assert.throws(() => {
  validateHyperbolaParameters({ semiTransverseA: 2, semiConjugateB: 3, centerX: NaN, centerY: 0, orientation: ORIENTATION_HORIZONTAL });
}, TypeError, 'Debe lanzar TypeError si h es NaN');

console.log('✓ Test 5 superado con éxito.');

console.log('\n======================================================');
console.log('¡TODAS LAS PRUEBAS MATEMÁTICAS FUERON SUPERADAS AL 100%!');
console.log('======================================================\n');
