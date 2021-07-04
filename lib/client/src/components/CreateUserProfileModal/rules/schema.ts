import * as Yup from 'yup';

export const userProfileSchema = Yup.object({
  access_level_id: Yup.string().required('Campo obrigatório.'),
  branch_id: Yup.string().required('Campo obrigatório.')
}).defined();
