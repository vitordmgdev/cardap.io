import { env } from "../env";
import { transport } from "../libs/transport";
import dayjs from "dayjs";

interface verifyEmailProps {
    receiver: string,
    otpCode: string,
    otpExpires: Date | null | undefined
};

const EmailService = {
    verifyEmail: async(
        { receiver, otpCode, otpExpires }: verifyEmailProps
    ) => {
        const format = dayjs(otpExpires).format("HH:mm")

        await transport.sendMail({
            from: `Vitor<${env.SMTP_USER}>`,
            to: receiver,
            subject: "Seu código de verificação cardap.io",
            text: `Aqui está seu código: ${otpCode}`,
            html: `
            <h1>Verificação da sua conta</h1>
            <p>Aqui está seu código: <strong>${otpCode}</strong></p>
            <p>O seu código expira às ${format}</p>
            `
        })
    }
};

export default EmailService;