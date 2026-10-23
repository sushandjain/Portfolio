interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter
 * @param key unique identifier (e.g. IP + action)
 * @param maxAttempts maximum requests allowed in the window
 * @param windowMs window duration in milliseconds
 * @returns { success: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  // Clean expired
  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: maxAttempts - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

export function resetRateLimit(key: string) {
  rateLimitMap.delete(key);
}
