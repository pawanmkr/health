import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env";

const ALGORITHM = "HS256";

export function generateToken(payload: JwtPayload, time: string): string {
    return jwt.sign(payload, env.JWT_SECRET_KEY, {
        algorithm: ALGORITHM,
        expiresIn: time,
    });
}