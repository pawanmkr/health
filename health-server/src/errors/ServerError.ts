export class ServerError extends Error {
    name: string;
    statusCode: number;
    isOperational: boolean;

    constructor(
        statusCode: number,
        message: string,
        isOperational = true,
        name?: string
    ) {
        super(message);
        this.name = name || "ServerError";
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}
