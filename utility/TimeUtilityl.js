import dayjs from 'dayjs';

export function toDateAndMonthFromEpoch(epoch) {
  return dateFormatter(epoch, 'DD MMM');
}

export function timeIn12HourFormat(epoch) {
  return dateFormatter(epoch, 'h:mm A');
}

export function toMonthAndYearFromEpoch(epoch) {
  return dateFormatter(epoch, 'MMM YYYY');
}
export const dateFormatter = (epoch, dateFormat) => {
  return dayjs(epoch).format(dateFormat);
};
