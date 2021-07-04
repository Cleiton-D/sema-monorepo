import * as Yup from 'yup';

export const addUserSchema = Yup.object({
  username: Yup.string().required('Campo obrigatório.'),
  login: Yup.string()
    .email('Digite um email válido.')
    .required('Campo obrigatório.')
});
