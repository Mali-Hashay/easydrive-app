import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatRentalDateTime = (date) => dayjs.utc(date)
    .tz('Asia/Jerusalem')
    .format('DD/MM/YYYY HH:mm');

export const formatRentalDate = (date, format = 'DD/MM/YYYY') => dayjs.utc(date)
    .tz('Asia/Jerusalem')
    .format(format);

export const formatRentalTime = (date) => dayjs.utc(date)
    .tz('Asia/Jerusalem')
    .format('HH:mm');

export const toIsraelISOString = (date, time) => dayjs.tz(`${date}T${time}`, 'Asia/Jerusalem').toISOString();

export const toIsraelISOStringFromDateTime = (dateTime) => dayjs.tz(dateTime, 'Asia/Jerusalem').toISOString();

export const calculateTotalDays = (startDate, startTime, endDate, endTime) => {
    if (!startDate || !endDate) 
        return 0;

    const start = dayjs(`${startDate}T${startTime || '00:00'}`);
    const end = dayjs(`${endDate}T${endTime || '00:00'}`);

    const diffHours = end.diff(start, 'hour', true);

    if (diffHours <= 0) 
        return 1;

    return Math.ceil(diffHours / 24);
};

export const calculateTotalPrice = (startDate, startTime, endDate, endTime, dailyPrice = 0) => {
    const totalDays = calculateTotalDays(startDate, startTime, endDate, endTime);
    return totalDays * dailyPrice;
};