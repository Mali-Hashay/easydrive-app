import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

const MIN_AGE_YEARS = 17;
const MIN_AGE_MONTHS = 9;
const MAX_AGE_YEARS = 80;

// תאריך לידה של נהג - טווח גילאים אחיד לכל טפסי ההזמנה (תהליך הזמנה עצמי ופאנל ניהול)
export default function DriverBirthDatePicker({ value, onChange, className, hasError, ...rest }) {
    const maxAllowedBirthDate = dayjs().subtract(MIN_AGE_YEARS, 'year').subtract(MIN_AGE_MONTHS, 'month').toDate();
    const minAllowedBirthDate = dayjs().subtract(MAX_AGE_YEARS, 'year').toDate();

    const handleChange = (date) => {
        onChange(date ? dayjs(date).format('YYYY-MM-DD') : '');
    };

    return (
        <DatePicker
            selected={value ? new Date(value) : null}
            onChange={handleChange}
            minDate={minAllowedBirthDate}
            maxDate={maxAllowedBirthDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className={`${className || ''} ${hasError ? 'input-error' : ''}`.trim()}
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            {...rest}
        />
    );
}
