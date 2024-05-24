export class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DatabaseError extends CustomError {}
export class WebhookError extends CustomError {}
export class DiscordError extends CustomError {}
