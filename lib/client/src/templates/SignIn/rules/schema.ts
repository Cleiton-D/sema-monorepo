import * as Yup from 'yup';

export const signInSchema = Yup.object({
  email: Yup.string().required('Campo obrigatório'),
  password: Yup.string().required('Campo obrigatório')
}).defined();
