import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 
export const sendEmail = async (smtpConfig, to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: smtpConfig.host, 
            port: smtpConfig.port || 465, 
            secure: smtpConfig.port === 465,
            auth: {
                user: smtpConfig.user, 
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: smtpConfig.user,
            to,
            subject,
            text,
            html,
            bcc: smtpConfig.user 
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}:`, info.response);

        return { success: true, message: "Email sent successfully", info };
    } catch (error) {
        console.error("❌ Error sending email:", error.stack || error);
        return { success: false, message: "Failed to send email", error };
    }
};