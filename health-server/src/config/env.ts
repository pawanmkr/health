import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
    PORT: z.coerce.number().min(1000),
    ENV: z
        .union([
            z.literal("development"),
            z.literal("testing"),
            z.literal("production"),
        ])
        .default("development"),
    PGHOST: z.string().min(1),
    PGPORT: z.coerce.number().min(1000),
    PGUSER: z.string().min(1),
    PGPASSWORD: z.string().min(1),
    PGDATABASE: z.string().min(1),
    AZURE_STORAGE_CONNECTION_STRING: z.string().min(1),
    AZURE_STORAGE_CONTAINER_NAME: z.string().min(1),
    AZURE_STORAGE_ACCOUNT_NAME: z.string().min(1),
    ANALYTICS_API_URL: z.string().url(),
});

// Validate `process.env` against our schema
// and return the result
const env = envSchema.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> { }
    }
}

// Export the result so we can use it in the project
export default env;
