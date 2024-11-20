import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
});
// API rate limiting
export const apiLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
// Login rate limiting
export const loginLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login attempts per hour
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
