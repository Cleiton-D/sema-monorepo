import * as Yup from 'yup';

export const addUserSchema = Yup.object({
  username: Yup.string().required('Campo obrigatório.'),
  login: Yup.string().required('Campo obrigatório.')
});
