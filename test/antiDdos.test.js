import assert from 'node:assert/strict';
import { AntiDdosRateLimiter } from '../src/security/antiDdos.js';

console.log('--- TEST: SISTEMA ANTI-DDOS / RATE LIMITING ---');

const limiter = new AntiDdosRateLimiter({
  windowMs: 1000,        // 1 segundo
  maxRequests: 5,        // Límite de 5 peticiones
  banThreshold: 10,      // Ban al llegar a 10
  banDurationMs: 2000,   // Ban de 2 segundos
  whitelist: ['10.0.0.1']
});

const fakeReq = (ip) => ({
  headers: {},
  socket: { remoteAddress: ip }
});

const attackerIp = '192.168.1.100';

// 1. Las primeras 5 peticiones deben ser permitidas
for (let i = 1; i <= 5; i++) {
  const res = limiter.checkRequest(fakeReq(attackerIp));
  assert.equal(res.allowed, true, `Petición ${i} debe permitirse`);
}

// 2. La petición 6 debe retornar 429 (Rate Limit)
const res6 = limiter.checkRequest(fakeReq(attackerIp));
assert.equal(res6.allowed, false, 'Petición 6 debe bloquearse');
assert.equal(res6.status, 429, 'Status debe ser 429 Too Many Requests');
console.log('✓ 429 Too Many Requests verificado al superar el umbral.');

// 3. Continuar inundando hasta alcanzar banThreshold (10 peticiones)
for (let i = 7; i <= 10; i++) {
  limiter.checkRequest(fakeReq(attackerIp));
}

// 4. La siguiente petición debe retornar 403 Ban
const bannedRes = limiter.checkRequest(fakeReq(attackerIp));
assert.equal(bannedRes.allowed, false, 'Petición post-flood debe ser rechazada');
assert.equal(bannedRes.status, 403, 'Status debe ser 403 Forbidden (Banned)');
console.log('✓ 403 Forbidden (Auto-Ban) activado correctamente tras flood.');

// 5. Verificar que IP en whitelist nunca es bloqueada
for (let i = 0; i < 20; i++) {
  const wlRes = limiter.checkRequest(fakeReq('10.0.0.1'));
  assert.equal(wlRes.allowed, true, 'IP en lista blanca nunca debe bloquearse');
}
console.log('✓ Whitelist verificada sin bloqueos.');

limiter.destroy();
console.log('\n¡TODAS LAS PRUEBAS DEL ANTI-DDOS COMPLETADAS CON ÉXITO!\n');
