import dayjs from 'dayjs';
import Swal from 'sweetalert2';
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

export const alertService = {
    success: (message = 'הפעולה בוצעה בהצלחה!') => {
        Toast.fire({
            icon: 'success',
            title: message,
        });
    },
    errorToast: (message = 'התרחשה שגיאה.') => {
        Toast.fire({
            icon: 'error',
            title: message,
        });
    },
    error: (message = 'התרחשה שגיאה במערכת.') => {
        Swal.fire({
            title: 'שגיאה',
            text: message,
            icon: 'error',
            confirmButtonText: 'הבנתי',
            confirmButtonColor: '#dc3545',
        });
    },
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
    // needs a click to close, unlike the toast which just disappears
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