const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const emailLayout = (content) => `
<!doctype html>
<html lang="he" dir="rtl">
  <body dir="rtl" style="margin:0;background:#f5f7fa;color:#1f2937;font-family:Arial,sans-serif;direction:rtl;">
    <div style="padding:32px 16px;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#d32f2f;padding:22px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:26px;">EasyDrive</h1>
        </div>
        <div dir="rtl" style="padding:32px 28px;direction:rtl;unicode-bidi:plaintext;">${content}</div>
        <div dir="rtl" style="padding:18px 28px;border-top:1px solid #e5e7eb;color:#6b7280;text-align:center;font-size:12px;direction:rtl;unicode-bidi:plaintext;">
          הודעה אוטומטית מ־EasyDrive. נא לא להשיב למייל זה.
        </div>
      </div>
    </div>
  </body>
</html>`;

export const resetPasswordEmail = ({ resetLink }) => ({
    subject: 'איפוס סיסמה - EasyDrive',
    text: `לחץ על הקישור הבא כדי לאפס את סיסמתך:\n${resetLink}\n\nהקישור תקף ל־15 דקות. אם לא ביקשת לאפס את הסיסמה, ניתן להתעלם ממייל זה.`,
    html: emailLayout(`
      <h2 dir="rtl" style="margin-top:0;color:#1f2937;text-align:center;direction:rtl;unicode-bidi:plaintext;">איפוס סיסמה</h2>
      <p dir="rtl" style="line-height:1.6;text-align:center;direction:rtl;unicode-bidi:plaintext;">קיבלנו בקשה לאיפוס הסיסמה שלך.</p>
      <p dir="rtl" style="line-height:1.6;text-align:center;direction:rtl;unicode-bidi:plaintext;">לחץ על הכפתור כדי להגדיר סיסמה חדשה:</p>
      <div style="margin:28px 0;text-align:center;">
        <a dir="rtl" href="${escapeHtml(resetLink)}" style="display:inline-block;background:#d32f2f;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:bold;direction:rtl;">איפוס סיסמה</a>
      </div>
      <p dir="rtl" style="color:#6b7280;font-size:13px;line-height:1.6;text-align:center;direction:rtl;unicode-bidi:plaintext;">הקישור תקף ל־15 דקות בלבד.</p>
      <p dir="rtl" style="color:#6b7280;font-size:13px;line-height:1.6;text-align:center;direction:rtl;unicode-bidi:plaintext;">אם לא ביקשת לאפס את הסיסמה, ניתן להתעלם ממייל זה.</p>
      <p dir="ltr" style="word-break:break-all;color:#6b7280;font-size:12px;text-align:center;direction:ltr;">${escapeHtml(resetLink)}</p>
    `)
});

export const contactAdminEmail = ({ name, email, phone, message }) => ({
    subject: `פנייה חדשה מאת: ${name}`,
    text: `פנייה חדשה מאת: ${name}\nמייל: ${email}\nטלפון: ${phone || 'לא הוזן טלפון'}\n\nתוכן ההודעה:\n${message}`,
    html: emailLayout(`
      <h2 dir="rtl" style="margin-top:0;color:#d32f2f;direction:rtl;unicode-bidi:plaintext;">פנייה חדשה התקבלה</h2>
      <div style="background:#f9fafb;padding:18px;border:1px solid #e5e7eb;border-radius:8px;line-height:1.7;">
        <p dir="rtl" style="direction:rtl;unicode-bidi:plaintext;"><strong>שם:</strong> ${escapeHtml(name)}</p>
        <p dir="rtl" style="direction:rtl;unicode-bidi:plaintext;"><strong>מייל:</strong> <span dir="ltr">${escapeHtml(email)}</span></p>
        <p dir="rtl" style="direction:rtl;unicode-bidi:plaintext;"><strong>טלפון:</strong> <span dir="ltr">${escapeHtml(phone || 'לא הוזן טלפון')}</span></p>
        <hr style="border:0;border-top:1px solid #d1d5db;margin:16px 0;" />
        <p dir="rtl" style="direction:rtl;unicode-bidi:plaintext;"><strong>תוכן ההודעה:</strong></p>
        <p dir="rtl" style="white-space:pre-wrap;direction:rtl;unicode-bidi:plaintext;">${escapeHtml(message)}</p>
      </div>
    `)
});

export const contactClientEmail = ({ name }) => ({
    subject: `היי ${name}, קיבלנו את פנייתך!`,
    text: `שלום ${name},\n\nתודה שפנית אלינו. פרטי הפנייה שלך התקבלו בהצלחה ונציג מטעמנו יחזור אלייך בהקדם האפשרי.`,
    html: emailLayout(`
      <h2 dir="rtl" style="margin-top:0;color:#2e7d32;text-align:center;direction:rtl;unicode-bidi:plaintext;">תודה שפנית אלינו!</h2>
      <p dir="rtl" style="line-height:1.7;text-align:center;direction:rtl;unicode-bidi:plaintext;">שלום ${escapeHtml(name)},</p>
      <p dir="rtl" style="line-height:1.7;text-align:center;direction:rtl;unicode-bidi:plaintext;">פרטי הפנייה שלך התקבלו בהצלחה במערכת שלנו.</p>
      <p dir="rtl" style="line-height:1.7;text-align:center;direction:rtl;unicode-bidi:plaintext;">נציג מטעמנו יבחן את הפרטים ויחזור אלייך בהקדם האפשרי.</p>
    `)
});

export const rentalConfirmationEmail = ({ name, car, pickupDate, plannedReturnDate, totalPrice }) => ({
    subject: 'אישור הזמנה - EasyDrive',
    text: `שלום ${name},\n\nההזמנה שלך אושרה בהצלחה.\n\nרכב: ${car.brand} ${car.model}\nאיסוף: ${pickupDate}\nהחזרה: ${plannedReturnDate}\nסך הכל לתשלום: ₪${totalPrice}\n\nתודה שבחרת ב-EasyDrive.`,
    html: emailLayout(`
      <h2 dir="rtl" style="margin-top:0;color:#2e7d32;text-align:center;direction:rtl;unicode-bidi:plaintext;">ההזמנה אושרה בהצלחה!</h2>
      <p dir="rtl" style="line-height:1.7;text-align:center;direction:rtl;unicode-bidi:plaintext;">שלום ${escapeHtml(name)},</p>
      <p dir="rtl" style="line-height:1.7;text-align:center;direction:rtl;unicode-bidi:plaintext;">שמחים לעדכן שההזמנה שלך נקלטה ואושרה.</p>
      <div dir="rtl" style="margin-top:24px;background:#f9fafb;padding:18px;border:1px solid #e5e7eb;border-radius:8px;line-height:1.7;direction:rtl;unicode-bidi:plaintext;">
        <p><strong>רכב:</strong> ${escapeHtml(`${car.brand} ${car.model}`)}</p>
        <p><strong>איסוף:</strong> <span dir="ltr">${escapeHtml(pickupDate)}</span></p>
        <p><strong>החזרה:</strong> <span dir="ltr">${escapeHtml(plannedReturnDate)}</span></p>
        <p><strong>סך הכל לתשלום:</strong> <span dir="ltr">₪${escapeHtml(totalPrice)}</span></p>
      </div>
      <p dir="rtl" style="line-height:1.7;text-align:center;direction:rtl;unicode-bidi:plaintext;">תודה שבחרת ב־EasyDrive.</p>
    `)
});
