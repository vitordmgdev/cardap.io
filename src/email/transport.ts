import nodemailer from "nodemailer";
import { env } from "../env";

export const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587 ,
    secure: false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
})