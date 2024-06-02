import { ExtendedPayload } from "../../middlewares/auth";

declare global {
    namespace Express {
        interface Request {
            token: ExtendedPayload;
        }
    }
}
