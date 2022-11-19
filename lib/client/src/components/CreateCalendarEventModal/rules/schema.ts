import * as Yup from 'yup';

export const calendarEventSchema = Yup.object({
  description: Yup.string().required('Campo obrigatório.')
}).defined();
