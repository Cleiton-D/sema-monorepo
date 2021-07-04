import * as Yup from 'yup';

export const documentsSchema = Yup.object({
  CPF: Yup.string().required('Campo Obrigatório.'),
  RG: Yup.string().required('Campo obrigatório.'),
  pis_pasep: Yup.string().required('Campo obrigatório.')
}).defined();
