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

export const employeeSchema = Yup.object({
  name: Yup.string().required('Campo obrigatório.'),
  mother_name: Yup.string().required('Campo obrigatório.'),
  birth_date: Yup.string().test(
    'test-birth_date',
    'Informe uma data válida',
    testBirthDate
  ),
  education_level: Yup.string().required('Campo obrigatório.'),
  address: addressSchema
}).defined();
