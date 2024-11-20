import { generateToken, verifyToken } from '../utils/security';
export const csrfProtection = (req, res, next) => {
    // Skip CSRF check for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const cookieToken = req.cookies['csrf-token'];
    if (!token || !cookieToken || !verifyToken(token, cookieToken)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next();
};
export const setCsrfToken = (req, res, next) => {
    const token = generateToken();
    res.cookie('csrf-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.locals.csrfToken = token;
    next();
};
