import { createWriteStream, WriteStream } from 'fs';
import { format } from 'date-fns';

class Logger {
    private logStream: WriteStream;

    constructor() {
        this.logStream = createWriteStream('errors.log', { flags: 'a' });
    }

    public logError(error: Error): void {
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const logMessage = `[${timestamp}] ${error.name}: ${error.message}\nStack: ${error.stack}\n\n`;
        this.logStream.write(logMessage);
        console.error(logMessage);
    }
}

export const logger = new Logger();
