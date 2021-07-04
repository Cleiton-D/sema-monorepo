import * as Yup from 'yup';

export const addGradeSchema = Yup.object({
  description: Yup.string().required('Campo obrigatório')
});
