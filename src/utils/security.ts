import { AES, enc } from 'crypto-js';
import { createHash } from 'crypto';

const SECRET_KEY = process.env.VITE_SECRET_KEY || 'default-secret-key';

export const security = {
  // Generate CSRF token
  generateToken: () => {
    return createHash('sha256')
      .update(Math.random().toString())
      .digest('hex');
  },

  // Verify CSRF token
  verifyToken: (token: string, storedToken: string) => {
    return token === storedToken;
  },

  // Encrypt data
  encrypt: (data: any): string => {
    return AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  },

  // Decrypt data
  decrypt: (encryptedData: string): any => {
    try {
      const bytes = AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = bytes.toString(enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  },

  // Sanitize user input
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove inline event handlers
      .trim();
  },

  // Generate random ID
  generateId: (length: number = 16): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((byte) => chars[byte % chars.length])
      .join('');
  },

  // Password validation
  validatePassword: (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  },

  // Headers security
  securityHeaders: {
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  },
};