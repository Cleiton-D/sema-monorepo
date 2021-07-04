export const translateContactType = (type: string) =>
  ({
    phone: 'Telefone',
    email: 'Email'
  }[type] || type);
