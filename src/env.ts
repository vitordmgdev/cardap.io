import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    COOKIE_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    SMTP_USER: z.string().email(),
    SMTP_PASS: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Variáveis de ambiente inválidas:", _env.error.format());
  throw new Error("Variáveis de ambiente inválidas.");
}

export const env = _env.data;