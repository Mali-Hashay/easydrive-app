import dayjs from 'dayjs';

/**
  =========================================================
   ולידציות משתמש ופרטים אישיים
  =========================================================
 */

// שם פרטי / שם משפחה
export const validateName = (name, fieldLabel = 'שם') => {
    if (!name || !name.trim()) 
        return `יש להזין ${fieldLabel}`;
    if (name.trim().length < 2) 
        return `${fieldLabel} חייב להכיל לפחות 2 אותיות`;
    if (!/^[a-zA-Zא-ת\s'-]+$/.test(name.trim())) 
        return `${fieldLabel} אינו תקין`;
    return '';
};

// כתובת אימייל
export const validateEmail = (email) => {
    if (!email || !email.trim()) 
        return 'יש להזין כתובת דוא"ל';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) 
        return 'כתובת דוא"ל אינה תקינה';
    return '';
};

// סיסמה
export const validatePassword = (password) => {
    if (!password) 
        return 'יש להזין סיסמה';
    if (password.length < 8) return 'ערך לא תקין (פחות משמונה תווים)';
    return '';
};

// מספר טלפון נייד 
export const validatePhone = (phone) => {
    if (!phone || !phone.trim()) 
        return 'יש להזין מספר טלפון';
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^05\d{8}$/.test(cleanPhone)) 
        return 'מספר טלפון אינו תקין ';
    return '';
};

// מספר תעודת זהות 
export const validateIdNumber = (idNumber) => {
    if (!idNumber) 
        return 'יש להזין מספר תעודת זהות';
    const cleanId = idNumber.toString().padStart(9, '0');
    if (!/^\d{9}$/.test(cleanId)) 
        return 'תעודת זהות חייבת להכיל 9 ספרות';
    
    const sum = Array.from(cleanId).reduce((acc, digit, idx) => {
        let step = Number(digit) * ((idx % 2) + 1);
        return acc + (step > 9 ? step - 9 : step);
    }, 0);
    
    if (sum % 10 !== 0) 
        return 'מספר תעודת זהות אינו תקין';
    return '';
};

// מספר רישיון נהיגה 
export const validateLicenseNumber = (licenseNumber) => {
    if (!licenseNumber) 
        return 'יש להזין מספר רישיון נהיגה';
    const cleanLicense = licenseNumber.replace(/\D/g, '');
    if (cleanLicense.length !== 9) 
        return 'מספר רישיון נהיגה חייב להכיל 9 ספרות';
    return '';
};

// תאריך לידה
export const validateBirthDate = (birthDate) => {
    if (!birthDate) 
        return 'יש לבחור תאריך לידה';
    
    const date = dayjs(birthDate);
    if (!date.isValid()) 
        return 'תאריך לידה אינו תקין';

    const maxAllowedBirthDate = dayjs().subtract(17, 'year').subtract(9, 'month');
    const minAllowedBirthDate = dayjs().subtract(80, 'year');

    if (date.isAfter(maxAllowedBirthDate)) 
        return 'השירות מיועד לבעלי ותק רישיון של חצי שנה לפחות)';
    
    if (date.isBefore(minAllowedBirthDate)) {
        return 'תאריך הלידה אינו בטווח התקני';
    }

    return '';
};

/*
  =========================================================
   ולידציות תשלום ואשראי
  =========================================================
 */

// מספר כרטיס אשראי 
export const validateCreditCard = (cardNumber) => {
    if (!cardNumber) 
        return 'יש להזין מספר כרטיס אשראי';
    const cleanCard = cardNumber.replace(/\D/g, '');
    if (cleanCard.length < 13 || cleanCard.length > 16) 
        return 'מספר כרטיס אשראי אינו תקין';
    return '';
};

// תוקף כרטיס אשראי 
export const validateExpiryDate = (expiry) => {
    if (!expiry) 
        return 'יש להזין תוקף';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return 'פורמט תוקף אינו תקין (MM/YY)';
    
    const [month, year] = expiry.split('/').map(Number);
    const fullYear = 2000 + year;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
        return 'פג תוקף הכרטיס';
    }
    return '';
};

// קוד CVV  
export const validateCVV = (cvv) => {
    if (!cvv) return 'יש להזין קוד CVV';
    if (!/^\d{3,4}$/.test(cvv)) return 'קוד CVV חייב להכיל 3 או 4 ספרות';
    return '';
};

// סכום לתשלום
export const validateAmount = (amount) => {
    if (amount === undefined || amount === null || amount === '') return 'יש להזין סכום';
    const num = Number(amount);
    if (isNaN(num) || num <= 0) return 'ערך לא תקין';
    return '';
};

/**
  =========================================================
     ולידציות ניהול רכב וקטגוריות
  =========================================================
 */

// יצרן / דגם
export const validateCarText = (val, fieldLabel) => {
    if (!val || !val.trim()) return `יש להזין ${fieldLabel}`;
    if (val.trim().length < 2) return 'יש להזין ערך בעל שני תווים לפחות';
    return '';
};

//לוחית רישוי
export const validateLicensePlate = (plate, year) => {
    if (!plate) return 'יש להזין לוחית רישוי';
    
    const cleanPlate = String(plate).replace(/\D/g, '');
    const carYear = Number(year);

    if (cleanPlate.length !== 7 && cleanPlate.length !== 8) {
        return 'לוחית רישוי חייבת להכיל 7 או 8 ספרות';
    }

    // בדיקות התאמה לפי שנת ייצור
    if (carYear) {
        // משנת 2018  -  8 ספרות
        if (carYear >= 2018 && cleanPlate.length !== 8) {
            return 'רכב משנת 2018 והלאה חייב להכיל לוחית רישוי של 8 ספרות';
        }
        // עד שנת 2016 -  7 ספרות
        if (carYear <= 2016 && cleanPlate.length !== 7) {
            return 'רכב משנת 2016 ומטה חייב להכיל לוחית רישוי של 7 ספרות';
        }
    }
    return '';
};

// שנת יצור  
export const validateCarYear = (year) => {
    if (!year) return 'יש להזין שנת יצור';
    const numYear = Number(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(numYear) || numYear < 1990 || numYear > currentYear + 1) {
        return 'ערך לא תקין ';
    }
    return '';
};

// מספר מקומות ישיבה
export const validateSeats = (seats) => {
    if (!seats) return 'יש להזין מספר מקומות';
    const numSeats = Number(seats);
    if (isNaN(numSeats) || numSeats < 2 || numSeats > 9) return 'מספר מקומות לא תקין ';
    return '';
};

// קילומטראז'
export const validateMileage = (mileage) => {
    if (mileage === undefined || mileage === null || mileage === '') return "יש להזין קילומטראז'";
    const numMileage = Number(mileage);
    if (isNaN(numMileage) || numMileage < 0) return "ערך לא תקין";
    return '';
};

// מחיר ליום
export const validateDailyPrice = (price) => {
    if (!price) return 'יש להזין מחיר ליום';
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) return 'מחיר אינו תקין';
    return '';
};

// שם קטגוריה
export const validateCategoryName = (categoryName) => {
    if (!categoryName || !categoryName.trim()) return 'יש להזין שם קטגוריה';
    if (categoryName.trim().length < 2) return 'שם קטגוריה חייב להכיל לפחות 2 אותיות';
    return '';
};

/**
  =========================================================
     ולידציית בחירת רשות/חובה 
  =========================================================
 */

export const validateRequiredSelect = (value, fieldLabel = 'שדה') => {
    if (!value) return `יש לבחור ${fieldLabel}`;
    return '';
};

/**
  =========================================================
     ולידציית  תאריכי השכרה 
  =========================================================
 */

export const validateRentalDates = (pickupDate, pickupTime, returnDate, returnTime) => {
    if (!pickupDate || !pickupTime) {
        return { pickupDate: 'יש להזין תאריך ושעת איסוף' };
    }

    if (!returnDate || !returnTime) {
        return { plannedReturnDate: 'יש להזין תאריך ושעת החזרה מתוכננים' };
    }

    const start = dayjs(`${pickupDate}T${pickupTime}`);
    const end = dayjs(`${returnDate}T${returnTime}`);

    if (end.isSame(start) || end.isBefore(start)) {
        return { plannedReturnDate: 'מועד ההחזרה חייב להיות מאוחר ממועד האיסוף' };
    }

    return null;
};

export const validateExtensionDate = (newDate, newTime, currentReturnDate) => {

    if (!newDate || !newTime) {
        return 'יש לבחור תאריך ושעת החזרה חדשים';
    }

    const newDateTime = dayjs(`${newDate}T${newTime}`);
    const originalDateTime = dayjs(currentReturnDate);

    if (newDateTime.isSame(originalDateTime) || newDateTime.isBefore(originalDateTime)) {
        return 'תאריך ושעת ההארכה חייבים להיות מאוחרים ממועד ההחזרה הנוכחי';
    }

    return ''; 
};


