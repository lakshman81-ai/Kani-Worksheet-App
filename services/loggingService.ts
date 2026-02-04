type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
    id: string;
    timestamp: number;
    level: LogLevel;
    message: string;
    details?: any;
}

type LogListener = (log: LogEntry) => void;

class LoggingService {
    private logs: LogEntry[] = [];
    private listeners: LogListener[] = [];
    private static instance: LoggingService;

    private constructor() { }

    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    private notifyListeners(log: LogEntry) {
        this.listeners.forEach(listener => listener(log));
    }

    public subscribe(listener: LogListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public log(level: LogLevel, message: string, details?: any) {
        const entry: LogEntry = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            level,
            message,
            details
        };

        this.logs.unshift(entry); // Add to beginning

        // Keep max 50 logs
        if (this.logs.length > 50) {
            this.logs.pop();
        }

        console.log(`[${level}] ${message}`, details || '');
        this.notifyListeners(entry);
    }

    public info(message: string, details?: any) {
        this.log('INFO', message, details);
    }

    public warn(message: string, details?: any) {
        this.log('WARN', message, details);
    }

    public error(message: string, details?: any) {
        this.log('ERROR', message, details);
    }

    public getLogs() {
        return this.logs;
    }

    public clear() {
        this.logs = [];
        this.info('Logs cleared');
    }
}

export const logger = LoggingService.getInstance();
