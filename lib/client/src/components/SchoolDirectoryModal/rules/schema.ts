import * as Yup from 'yup';

export const schoolDirectorySchema = Yup.object({
  director_id: Yup.string().required('Campo obrigatório.'),
  vice_director_id: Yup.string().required('Campo obrigatório.')
}).defined();
