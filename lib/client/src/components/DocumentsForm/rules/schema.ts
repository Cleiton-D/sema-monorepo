import * as Yup from 'yup';

export const documentsSchema = Yup.object({
  cpf: Yup.string().required('Campo Obrigatório.'),
  rg: Yup.string().required('Campo obrigatório.'),
  pis_pasep: Yup.string().required('Campo obrigatório.')
}).defined();
