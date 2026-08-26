// סטטוסים של הזמנות
export const rentalStatuses = {
    'confirmed': 'מאושר',
    'cancelled': 'מבוטל',
    'completed': 'הושלם',
    'active': 'פעיל',
    'overdue': 'באיחור',
    'deleted': 'נמחק',
};

// סטטוסים של רכבים 
export const carStatuses = {
    'available': 'זמין',
    'maintenance': 'בטיפול',
    'rented': 'מושכר',
    'inActive': 'לא זמין'
};

//סטטוסים של קטגוריות
export const categoryStatuses = {
    'active': 'פעילה',
    'inActive': 'לא פעילה',
};

//סטטוסים של תשלומים 
export const paymentStatuses = {
    pending: 'ממתין',
    authorized: 'מאושר',
    paid: 'שולם',
    failed: 'נכשל',
    refunded: 'זוכוי',
    partial_refund: 'זיכוי חלקי',
    cancelled: 'בוטל'
};

//סטטוסים של משתמשים
export const userStatuses = {
    'active': 'פעיל',
    'blocked': 'חסום',
    'inactive': 'לא פעיל'
};

//סוגי גיר
export const carsTransmission = {
    'manual':'ידני',
    'automatic': 'אוטומטי'
}

//סוגי דלק
export const fuelTypes ={
    'electric': 'חשמלי',
    'hybrid': 'היברידי',
    'gasoline': 'בנזין',
    'diesel': 'סולר'
}

//אמצעי תשלום
export const paymentMethods = {
    'cash': 'מזומן',
    'credit_card': 'אשראי',
    'bank_transfer': 'העברה בנקאית'
}