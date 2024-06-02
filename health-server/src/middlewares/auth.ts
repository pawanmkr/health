import { NextFunction, Request, Response } from "express";
import { errorHandler, ServerError } from "../errors";
import { UUID } from "crypto";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import env from "../config/env";

export interface ExtendedPayload extends JwtPayload {
    user_uuid: UUID;
    phone: string;
    type: "driver" | "admin";
}

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        throw new ServerError(401, "Unauthorized");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token, res);
    if (!decoded) return;

    req.token = decoded!;
    next();
}

function verifyToken(
    token: string,
    res: Response
): ExtendedPayload | undefined {
    try {
        return jwt.verify(token, env.JWT_SECRET_KEY) as ExtendedPayload;
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            errorHandler.handleError(
                new ServerError(401, "Token Expired"),
                res
            );
        } else if (err instanceof JsonWebTokenError) {
            errorHandler.handleError(
                new ServerError(401, "Invalid Token"),
                res
            );
        } else {
            throw err;
        }
        return undefined;
    }
}