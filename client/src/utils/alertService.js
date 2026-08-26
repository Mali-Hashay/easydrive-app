import dayjs from 'dayjs';
import Swal from 'sweetalert2';
//הודעות הצלחה מהירות
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

    //הפעלת הודעות הצלחה מהירות
export const alertService = {
    success: (message = 'הפעולה בוצעה בהצלחה!') => {
        Toast.fire({
            icon: 'success',
            title: message,
        });
    },
    //הפעלת הודעות שגיאה מהירות
    errorToast: (message = 'התרחשה שגיאה.') => {
        Toast.fire({
            icon: 'error',
            title: message,
        });
    },
    //הודעת שגיאה הדורשת אישור
    error: (message = 'התרחשה שגיאה במערכת.') => {
        Swal.fire({
            title: 'שגיאה',
            text: message,
            icon: 'error',
            confirmButtonText: 'הבנתי',
            confirmButtonColor: '#dc3545',
        });
    },
    //הודעה כללית
    confirm: async (title = 'האם אתה בטוח?', text = '', isDanger = true) => {
        const result = await Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isDanger ? '#dc3545' : '#28a745', 
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'המשך',
            cancelButtonText: 'ביטול',
        });
        
        return result.isConfirmed; 
    },
    //מודאל הצלחה שממתין לאישור
    successModal: async (title = '!הפעולה! התבצעה בהצלחה', text = '') => {
        const result = await Swal.fire({
            title,
            text,
            icon: 'success',
            confirmButtonText: 'הבנתי, תודה',
            confirmButtonColor: '#28a745',
        });
        return result.isConfirmed;
    },
};