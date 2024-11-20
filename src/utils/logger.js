class Logger {
    constructor() {
        Object.defineProperty(this, "logs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxLogs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
    }
    createEntry(level, message, data) {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            data,
        };
    }
    addLog(entry) {
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        // In production, send logs to server
        if (process.env.NODE_ENV === 'production') {
            this.sendToServer(entry);
        }
    }
    async sendToServer(entry) {
        try {
            await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });
        }
        catch (error) {
            console.error('Failed to send log to server:', error);
        }
    }
    info(message, data) {
        const entry = this.createEntry('info', message, data);
        this.addLog(entry);
        console.log(`[INFO] ${message}`, data);
    }
    warn(message, data) {
        const entry = this.createEntry('warn', message, data);
        this.addLog(entry);
        console.warn(`[WARN] ${message}`, data);
    }
    error(message, error) {
        const entry = this.createEntry('error', message, error);
        this.addLog(entry);
        console.error(`[ERROR] ${message}`, error);
    }
    getLogs() {
        return this.logs;
    }
}
export const logger = new Logger();
