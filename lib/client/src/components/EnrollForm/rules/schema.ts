import * as Yup from 'yup';

export const enrollSchema = Yup.object({
  grade_id: Yup.string().required('Campo obrigatório.'),
  class_period_id: Yup.string().required('Campo obrigatório.'),
  classroom_id: Yup.string().required('Campo obrigatório.')
});
