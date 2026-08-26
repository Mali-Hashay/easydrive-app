import React, { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import styles from "./RentalDateAndTime.module.css"; 

export default function RentalDateAndTime({
  dateLabel,
  timeLabel,
  dateValue, 
  timeValue, 
  onDateChange,
  onTimeChange,
  minDate, 
  compareDate,
  compareTime,
  inputClassName = '',
  hasError,
  mode = 'both'
}) {
  const selectedDate = dateValue ? dayjs(dateValue).toDate() : null;
  const selectedTime = (dateValue && timeValue) 
    ? dayjs(`${dateValue}T${timeValue}`).toDate() 
    : null;

  const isAvailableDay = (date) => {
    const dayOfWeek = dayjs(date).day();
    if (dayOfWeek === 6) return false;

    const today = dayjs();
    if (!dayjs(date).isSame(today, 'day')) return true;

    const endHour = dayOfWeek === 5 ? 12 : 20;
    const businessEnd = dayjs(date).hour(endHour).minute(0).second(0);
    return today.isBefore(businessEnd, 'minute');
  };

  // חישוב  של כל השעות המורשות לבחירה
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];

    const dayOfWeek = dayjs(selectedDate).day();
    if (dayOfWeek === 6) return [];

    const endHour = dayOfWeek === 5 ? 12 : 20;
    let times = [];

    for (let h = 8; h <= endHour; h++) {
      times.push(dayjs(selectedDate).hour(h).minute(0).second(0).toDate());
      if (h !== endHour) {
        times.push(dayjs(selectedDate).hour(h).minute(30).second(0).toDate());
      }
    }

    const now = dayjs();
    
    // סינון שעות שכבר עברו במידה  והיום הנוכחי נבחר
    let filtered = times;
    if (dayjs(selectedDate).isSame(now, 'day')) 
      filtered = filtered.filter((t) => dayjs(t).isAfter(now, 'minute'));
    
    // סינון שעות שקודמות לשעת האיסוף (כאשר תאריך האיסוף וההחזרה זהים)
    if (compareDate && compareTime && dayjs(selectedDate).isSame(dayjs(compareDate), 'day')) {
      const compareDateTime = dayjs(`${compareDate}T${compareTime}`);
      filtered = filtered.filter((t) => dayjs(t).isAfter(compareDateTime, 'minute'));
    }

    return filtered;
  }, [selectedDate, compareDate, compareTime]);


  const handleDateChange = (date) => {
    if (!date) {
      if (onDateChange) onDateChange('');
      if (onTimeChange) onTimeChange('');
      return;
    }

    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    if (onDateChange) onDateChange(formattedDate);

    // כאשר נבחר יום ואז שונה ליום ו'- איפוס שעה אם היא חורגת משעות הפעילות
    if (dayjs(date).day() === 5 && timeValue > '12:00') {
      if (onTimeChange) onTimeChange('');
    }

    //  טיפל במצב שבו תאריך ההחזרה משתנה לערך זהה לתאריך  האיסוף והשעה שנבחרה כבר אינה חוקית
    if (
      compareDate &&
      compareTime &&
      formattedDate === compareDate &&
      (!timeValue || timeValue <= compareTime)
    ) {
      if (onTimeChange) onTimeChange('');
    }
  };

  const handleTimeChange = (time) => {
    if (!time) {
      if (onTimeChange) onTimeChange('');
      return;
    }
    if (onTimeChange) onTimeChange(dayjs(time).format('HH:mm'));
  };

  const computedInputClass = `${inputClassName} ${hasError ? 'input-error' : ''}`.trim();

  return (
    <div className={styles.container}>
      {mode !== 'time' && (
        <div className={styles.inputField}>
          {dateLabel && <label>{dateLabel}</label>}
          <DatePicker 
            selected={selectedDate}
            onChange={handleDateChange}
            filterDate={isAvailableDay}
            minDate={minDate ? dayjs(minDate).toDate() : new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="בחר תאריך"
            className={computedInputClass}
            popperPlacement="top-start"
            popperProps={{ strategy: 'fixed' }}
          />
        </div>
      )}

      {mode !== 'date' && (
        <div className={styles.inputField}>
          {timeLabel && <label>{timeLabel}</label>}
          <DatePicker
            selected={selectedTime}
            onChange={handleTimeChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            includeTimes={availableTimes}
            timeCaption="שעה"
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            placeholderText="בחר שעה"
            disabled={!dateValue || availableTimes.length === 0}
            className={computedInputClass}
            popperPlacement="top-start"
            popperProps={{ strategy: 'fixed' }}
          />
        </div>
      )}
    </div>
  );
}