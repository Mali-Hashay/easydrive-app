import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text, html = null, replyTo = null) => {
    try {
        console.log("SENDER EMAIL BEING USED:", process.env.EMAIL_USER);
        const msg = {
            to,
            from: {
                email: process.env.EMAIL_USER,
                name: "EasyDrive"
            },
            subject,
            text: text || ' ',
            html: html || undefined,
            replyTo: replyTo || undefined
        };

        await sgMail.send(msg);
        console.log(`Email sent successfully via SendGrid to: ${to}`);
    } catch (error) {
        console.error("Error in sendEmail (SendGrid):", error.response ? error.response.body : error);
        throw new Error("שגיאה בתהליך שליחת המייל");
    }
};