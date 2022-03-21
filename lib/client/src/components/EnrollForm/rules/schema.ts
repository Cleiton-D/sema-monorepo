import * as Yup from 'yup';

export const enrollSchema = Yup.object({
  unique_code: Yup.string().required('Campo obrigatório.'),
  grade_id: Yup.string().required('Campo obrigatório.'),
  class_period_id: Yup.string().required('Campo obrigatório.'),
  classroom_id: Yup.string().nullable()
});
