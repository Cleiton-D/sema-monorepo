import * as Yup from 'yup';

export const changePasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .required('Campo obrigatório.'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('newPassword')],
    'As senhas não conferem.'
  )
});
