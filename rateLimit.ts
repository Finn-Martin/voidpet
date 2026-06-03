import { Request, Response, NextFunction } from 'express';
const store = new Map<string, { count: number; reset: number }>();
export function rateLimiter({ windowMs = 900000, max = 200, message = 'Rate limit exceeded' } = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const entry = store.get(key);
    if (!entry || now > entry.reset) {
      store.set(key, { count: 1, reset: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      return res.status(429).json({ success: false, error: message });
    }
    entry.count++;
    next();
  };
}
