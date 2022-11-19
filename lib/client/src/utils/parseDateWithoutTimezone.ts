import parseISO from 'date-fns/parseISO';

export const parseDateWithoutTimezone = (date: string | Date) => {
  if (date instanceof Date) return date;

  const normalizedDate = date.replace(/z$/i, '');
  return parseISO(normalizedDate);
};
