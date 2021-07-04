import * as Yup from 'yup';

export const addAccessLevelSchema = Yup.object({
  description: Yup.string().required('Campo obrigatório.')
});
