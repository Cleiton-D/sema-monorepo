export const masks = {
  time: (value?: string) => {
    if (!value) return value;

    const newValue = value.replace(/\D/g, '');

    if (newValue.length <= 2) return newValue;

    const start = newValue.substring(0, 2);
    const end = newValue.substring(2, 4);

    return `${start}:${end}`;
  },
  date: (value: string) => {
    const newValue = value
      .replace(/\D/g, '')
      .replace(/(^[0-9]{2})/, '$1/')
      .replace(/(^[0-9]{2})\/([0-9]{2})/, '$1/$2/')
      .replace(/(^[0-9]{2})\/([0-9]{2})\/([0-9]{4})$/, '$1/$2/$3')
      .replace(/(^[0-9]{2}\/[0-9]{2}\/[0-9]{4})\d+?$/, '$1');

    return newValue;
  },
  'school-report-field': (value: string) => {
    if (String(value) === '100') {
      return '1.0';
    }

    const newValue = value
      .replace(/\D/g, '')
      .replace(/(^10)(0)/, '$1.$2')
      .replace(/(^10\.0)([1-9])/, '$1')
      .replace(/(^(?!^10)[0-9])([0-9])/, '$1.$2')
      .replace(/(^10|[0-9]\.[0-9])(\d+?$)/, '$1');

    return newValue;
  },
  'school-report': (value: string) => {
    const normalizedValue = value.padStart(4, '0');

    const newValue = normalizedValue
      .replace(/\D/g, '')
      .replace(/(^10)(0)/, '$1.$2')
      .replace(/(^10\.0)([1-9])/, '$1')
      .replace(/(^0)([0-9])/, '$2')
      .replace(/(^(?!^10)[0-9])([0-9])/, '$1.$2');
    // .replace(/(^10|[0-9]\.[0-9])(\d+?$)/, '$1');

    if (String(value) === '100') {
      console.log(value, newValue);
    }

    return newValue;
  }
};
