import { useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { Scope, FormHandles as UnformHandles } from '@unform/core';
import { PrimitiveAtom, useAtom } from 'jotai';
import { ValidationError } from 'yup';

import TextInput from 'components/TextInput';

import { EmployeeBasicFormData } from 'models/Employee';
import { FormHandles } from 'models/Form';

import { employeeSchema } from './rules/schema';

import * as S from './styles';

type EmployeeFormProps = {
  jotaiState: PrimitiveAtom<EmployeeBasicFormData>;
};

const EmployeeForm: React.ForwardRefRenderFunction<
  FormHandles,
  EmployeeFormProps
> = ({ jotaiState }, ref) => {
  const [state, setState] = useAtom(jotaiState);

  const formRef = useRef<UnformHandles>(null);

  const handleSubmit = useCallback(
    async (values: EmployeeBasicFormData) => {
      try {
        formRef.current?.setErrors({});

        await employeeSchema.validate(values, { abortEarly: false });
        setState(values);
      } catch (err) {
        if (err instanceof ValidationError) {
          const validationErrors: Record<string, string> = {};

          err.inner.forEach((error) => {
            if (error.path) {
              validationErrors[error.path] = error.message;
            }
          });

          formRef.current?.setErrors(validationErrors);
        }

        throw err;
      }
    },
    [setState]
  );

  const submitForm = useCallback(async () => {
    const values = formRef.current?.getData() as EmployeeBasicFormData;
    await handleSubmit(values);
  }, [handleSubmit]);

  useImperativeHandle(ref, () => ({ submitForm }));

  return (
    <S.Wrapper>
      <S.SectionTitle>
        <h4>Dados pessoais</h4>
      </S.SectionTitle>
      <S.Form onSubmit={handleSubmit} initialData={state} ref={formRef}>
        <S.FieldsContainer>
          <TextInput label="Nome" name="name" />
          {/* <TextInput label="Data de nascimento" name="birth_date" mask="date" /> */}
          {/* <TextInput label="Nome da mãe" name="mother_name" />
          <TextInput label="Nome do pai" name="dad_name" /> */}
          <TextInput label="Grau de Instrução" name="education_level" />
        </S.FieldsContainer>

        {/* <Scope path="address">
          <S.SectionTitle style={{ marginTop: '2rem' }}>
            <h4>Endereço</h4>
          </S.SectionTitle>

          <S.FieldsContainer>
            <TextInput name="street" label="Logradouro" />
            <TextInput name="house_number" label="Número" />
            <TextInput name="city" label="Cidade" />
            <TextInput name="district" label="Bairro" />
            <TextInput name="region" label="Região" />
          </S.FieldsContainer>
        </Scope> */}
      </S.Form>
    </S.Wrapper>
  );
};

export default forwardRef(EmployeeForm);
