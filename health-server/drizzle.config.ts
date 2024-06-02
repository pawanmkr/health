// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import env from "./src/config/env";

export default defineConfig({
    schema: "./src/schema/*.ts",
    out: "./migrations",
    dialect: "postgresql",
    verbose: true,
    strict: true,
    dbCredentials: {
        host: env.PGHOST,
        password: env.PGPASSWORD,
        user: env.PGUSER,
        database: env.PGDATABASE,
        port: env.PGPORT,
        ssl: env.ENV === "production" ? true : false,
    },
    tablesFilter: ["users", "sheets", "health_reports"],
});