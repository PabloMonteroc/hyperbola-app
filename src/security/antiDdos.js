/**
 * Sistema básico de mitigación Anti-DDoS / Rate Limiting (Capa 7).
 * Implementa control de ráfagas (bursting), ventanas deslizantes y bloqueo temporal (ban) por IP.
 */

export class AntiDdosRateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 10000;         // Ventana de 10 segundos
    this.maxRequests = options.maxRequests || 35;       // Máximo de peticiones permitidas en la ventana
    this.banThreshold = options.banThreshold || 70;     // Si supera esto en la misma ventana, se considera ataque -> Ban
    this.banDurationMs = options.banDurationMs || 60000;// Tiempo de bloqueo (1 minuto)
    this.whitelist = new Set(options.whitelist || ['127.0.0.1', '::1']);

    this.clients = new Map(); // ip -> { count: number, windowStart: number, bannedUntil: number }

    // Limpieza automática periódica para evitar fugas de memoria en el heap
    this.cleanupTimer = setInterval(() => this.cleanupExpiredClients(), this.windowMs * 2);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    return req.headers['x-real-ip'] ||
           req.socket?.remoteAddress ||
           req.connection?.remoteAddress ||
           'unknown';
  }

  isWhitelisted(ip) {
    return this.whitelist.has(ip);
  }

  checkRequest(req) {
    const ip = this.getClientIp(req);

    if (this.isWhitelisted(ip)) {
      return { allowed: true, ip, remaining: this.maxRequests };
    }

    const now = Date.now();
    let client = this.clients.get(ip);

    if (!client) {
      client = { count: 1, windowStart: now, bannedUntil: 0 };
      this.clients.set(ip, client);
      return {
        allowed: true,
        ip,
        remaining: this.maxRequests - 1,
        resetTime: client.windowStart + this.windowMs
      };
    }

    // Comprobar si la IP está activamente baneada
    if (client.bannedUntil > now) {
      const remainingBanSeconds = Math.ceil((client.bannedUntil - now) / 1000);
      return {
        allowed: false,
        status: 403,
        ip,
        retryAfter: remainingBanSeconds,
        message: 'IP temporalmente baneada por actividad sospechosa / exceso de ráfaga (Anti-DDoS).'
      };
    }

    // Si la ventana expiró, reiniciar contador
    if (now - client.windowStart > this.windowMs) {
      client.count = 1;
      client.windowStart = now;
      client.bannedUntil = 0;
      return {
        allowed: true,
        ip,
        remaining: this.maxRequests - 1,
        resetTime: client.windowStart + this.windowMs
      };
    }

    // Si aún está dentro de la ventana de tiempo
    client.count++;

    // Detección de flood severo -> Activar baneo
    if (client.count >= this.banThreshold) {
      client.bannedUntil = now + this.banDurationMs;
      const banSeconds = Math.ceil(this.banDurationMs / 1000);
      return {
        allowed: false,
        status: 403,
        ip,
        retryAfter: banSeconds,
        message: 'Ataque de peticiones detectado. Tu dirección IP ha sido bloqueada temporalmente.'
      };
    }

    // Exceso normal de rate limit
    if (client.count > this.maxRequests) {
      const resetSeconds = Math.ceil((client.windowStart + this.windowMs - now) / 1000);
      return {
        allowed: false,
        status: 429,
        ip,
        retryAfter: resetSeconds,
        message: 'Demasiadas peticiones por segundo (Rate Limit excedido). Por favor espera.'
      };
    }

    return {
      allowed: true,
      ip,
      remaining: this.maxRequests - client.count,
      resetTime: client.windowStart + this.windowMs
    };
  }

  cleanupExpiredClients() {
    const now = Date.now();
    for (const [ip, data] of this.clients.entries()) {
      if (data.bannedUntil <= now && now - data.windowStart > this.windowMs) {
        this.clients.delete(ip);
      }
    }
  }

  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clients.clear();
  }
}

/**
 * Middleware genérico compatible con Connect, Express, Vite dev server y Node http.
 */
export function createAntiDdosMiddleware(options = {}) {
  const limiter = new AntiDdosRateLimiter(options);

  return (req, res, next) => {
    const result = limiter.checkRequest(req);

    // Headers informativos estándar de Rate Limiting
    res.setHeader('X-RateLimit-Limit', limiter.maxRequests);
    if (result.remaining !== undefined) {
      res.setHeader('X-RateLimit-Remaining', Math.max(0, result.remaining));
    }

    if (!result.allowed) {
      res.setHeader('Retry-After', result.retryAfter);
      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({
        error: result.message,
        statusCode: result.status,
        clientIp: result.ip,
        retryAfterSeconds: result.retryAfter
      }));
      return;
    }

    next();
  };
}

/**
 * Plugin nativo para Vite (inyecta la protección en `npm run dev` y `npm run preview`).
 */
export function viteAntiDdosPlugin(options = {}) {
  return {
    name: 'vite-plugin-anti-ddos',
    configureServer(server) {
      server.middlewares.use(createAntiDdosMiddleware(options));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createAntiDdosMiddleware(options));
    }
  };
}
