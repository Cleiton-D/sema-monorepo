import * as Yup from 'yup';

export const addSchoolSubjectSchema = Yup.object({
  description: Yup.string().required('Campo obrigatório'),
  additional_description: Yup.string().required('Campo obrigatório')
});
