import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import env from "./env";

const client = new Client({
    host: env.PGHOST,
    port: env.PGPORT,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    database: env.PGDATABASE,
    ssl: env.ENV === "production" ? true : false,
});

export async function connectDatabase() {
    try {
        await client.connect();
        console.log("\n[DATABASE]: Database client connected successfully");
    } catch (error) {
        console.error(error);
    }
}

const db = drizzle(client);
export default db;