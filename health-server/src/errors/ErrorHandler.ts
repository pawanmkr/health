import { Response } from "express";
import { ServerError } from "./ServerError";
import { logger } from "../utils/logger";
import { DatabaseError } from "pg";


class ErrorHandler {
    public handleError(error: Error | ServerError, response?: Response): void {
        if (this.isTrustedError(error) && response) {
            this.handleTrustedError(error as ServerError, response);
        } else {
            this.handleUntrustedError(error, response);
        }
    }

    isTrustedError(error: Error | DatabaseError): boolean {
        if (error instanceof ServerError) {
            return error.isOperational;
        }

        return false;
    }

    private handleTrustedError(error: ServerError, res?: Response) {
        if (!res?.headersSent) {
            // Check if headers have been sent already
            res?.status(error.statusCode).json({ message: error.message });
        }
    }

    private handleUntrustedError(error: ServerError | Error, res?: Response) {
        res?.status(500);

        logger.info("Server Encountered an untrusted Error");
        logger.error(error);

        // exitHandler.handleExit(1);
        // Instead of Shutting down the server, we can send email to the developer about the error
    }
}

export const errorHandler = new ErrorHandler();
