import * as Yup from 'yup';

export const studentDocumentsSchema = Yup.object({
  cpf: Yup.string(),
  rg: Yup.string(),
  birth_certificate: Yup.string()
}).defined();
