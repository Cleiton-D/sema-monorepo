import * as Yup from 'yup';
import { isValid } from 'date-fns';

const testBirthDate = (value: any) => {
  if (!value) return false;

  const newValue = value.replace(
    /(^[0-9]{2})\/([0-9]{2})\/([0-9]{4})$/,
    '$3-$2-$1'
  );

  return isValid(new Date(newValue));
};

export const addressSchema = Yup.object({
  street: Yup.string().required('Campo obrigatário.'),
  house_number: Yup.string().required('Campo obrigatário.'),
  city: Yup.string().required('Campo obrigatário.'),
  district: Yup.string().required('Campo obrigatário.')
});

export const studentSchema = Yup.object({
  name: Yup.string().required('Campo obrigatório.'),
  gender: Yup.string().required('Campo obrigatório.'),
  mother_name: Yup.string().required('Campo obrigatório.'),
  birth_date: Yup.string().test(
    'test-birth_date',
    'Informe uma data válida',
    testBirthDate
  ),
  breed: Yup.string().required('Campo obrigatório.'),
  naturalness: Yup.string().required('Campo obrigatório.'),
  naturalness_uf: Yup.string().required('Campo obrigatório.'),
  identity_document: Yup.string().required('Campo obrigatório.'),
  nationality: Yup.string().required('Campo obrigatório.'),
  address: addressSchema
}).defined();
