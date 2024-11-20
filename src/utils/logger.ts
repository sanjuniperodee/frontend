type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private createEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In production, send logs to server
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(entry);
    }
  }

  private async sendToServer(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  info(message: string, data?: any) {
    const entry = this.createEntry('info', message, data);
    this.addLog(entry);
    console.log(`[INFO] ${message}`, data);
  }

  warn(message: string, data?: any) {
    const entry = this.createEntry('warn', message, data);
    this.addLog(entry);
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, error?: any) {
    const entry = this.createEntry('error', message, error);
    this.addLog(entry);
    console.error(`[ERROR] ${message}`, error);
  }

  getLogs() {
    return this.logs;
  }
}

export const logger = new Logger();