// sends transactional emails through Brevo's HTTP API 
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendEmail = async (to, subject, text, html = null, replyTo = null) => {
    try {
        const body = {
            sender: {
                email: process.env.EMAIL_USER,
                name: "EasyDrive"
            },
            to: [{ email: to }],
            subject,
            textContent: text || ' ',
            htmlContent: html || undefined,
            replyTo: replyTo ? { email: replyTo } : undefined
        };

        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // fetch doesn't throw on error responses, so check the status
        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            throw errorBody || new Error(`Brevo responded with status ${response.status}`);
        }

        console.log(`Email sent successfully via Brevo to: ${to}`);
    } catch (error) {
        console.error("Error in sendEmail (Brevo):", error);
        throw new Error("שגיאה בתהליך שליחת המייל");
    }
};
