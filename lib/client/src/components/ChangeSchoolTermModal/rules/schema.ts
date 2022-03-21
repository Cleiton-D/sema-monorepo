import * as Yup from 'yup';

export const schoolTermSchema = Yup.object({
  date_start: Yup.date().required('Campo obrigatório.'),
  date_end: Yup.date().required('Campo obrigatório.')
});
