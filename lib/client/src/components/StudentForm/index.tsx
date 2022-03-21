import {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo
} from 'react';
import { Scope, FormHandles as UnformHandles } from '@unform/core';
import { PrimitiveAtom, useAtom } from 'jotai';
import { ValidationError } from 'yup';

import TextInput from 'components/TextInput';
import Select from 'components/Select';

import { StudentForm as StudentFormData } from 'models/Student';
import { FormHandles } from 'models/Form';

import { studentSchema } from './rules/schema';

// import ufs from 'assets/data/uf.json';

import * as S from './styles';

type PersonFormProps = {
  jotaiState: PrimitiveAtom<StudentFormData>;
  ufs: Array<{
    nome: string;
    sigla: string;
  }>;
};

const StudentForm: React.ForwardRefRenderFunction<
  FormHandles,
  PersonFormProps
> = ({ jotaiState, ufs }, ref) => {
  const [state, setState] = useAtom(jotaiState);

  const formRef = useRef<UnformHandles>(null);

  const handleSubmit = useCallback(
    async (values: StudentFormData) => {
      try {
        formRef.current?.setErrors({});

        await studentSchema.validate(values, { abortEarly: false });
        setState(values);
      } catch (err) {
        if (err instanceof ValidationError) {
          const validationErrors: Record<string, string> = {};

          err.inner.forEach((error) => {
            if (error.path) {
              validationErrors[error.path] = error.message;
            }
          });

          console.error(validationErrors);
          formRef.current?.setErrors(validationErrors);
        }

        throw err;
      }
    },
    [setState]
  );

  const submitForm = useCallback(async () => {
    const values = formRef.current?.getData() as StudentFormData;

    await handleSubmit(values);
  }, [handleSubmit]);

  const ufsOptions = useMemo(() => {
    return ufs.map(({ nome, sigla }) => ({
      label: `${nome} (${sigla})`,
      value: sigla
    }));
  }, [ufs]);

  useImperativeHandle(ref, () => ({ submitForm }));

  return (
    <S.Wrapper>
      <S.SectionTitle>
        <h4>Dados pessoais</h4>
      </S.SectionTitle>
      <S.Form onSubmit={handleSubmit} initialData={state} ref={formRef}>
        <S.FieldsContainer>
          {/* <S.CheckBoxContainer>
            <Checkbox
              label="Ex-aluno"
              labelFor="old-student"
              isChecked={oldStudent}
              onCheck={handleOldStudent}
            />
          </S.CheckBoxContainer> */}

          {/* {oldStudent && (
            <S.AutocompleteContainer>

            </S.AutocompleteContainer>
          )} */}

          <TextInput label="Nome" name="name" />
          <TextInput label="Data de nascimento" name="birth_date" mask="date" />
          <Select
            label="Sexo"
            name="gender"
            options={[
              { label: 'Masculino', value: 'male' },
              { label: 'Feminino', value: 'female' }
            ]}
          />
          <TextInput label="Nome da mãe" name="mother_name" />
          <TextInput label="Nome do pai" name="dad_name" />
          <Select
            label="Raça/Cor"
            name="breed"
            options={[
              { label: 'Amarela', value: 'Amarela' },
              { label: 'Branca', value: 'Branca' },
              { label: 'Parda', value: 'Parda' },
              { label: 'Preta', value: 'Preta' },
              { label: 'Indígena', value: 'Indígena' }
            ]}
          />
          <TextInput label="Naturalidade" name="naturalness" />
          <Select
            label="Naturalidade - UF"
            name="naturalness_uf"
            options={ufsOptions}
          />
          <Select
            label="Documento de identidade civil"
            name="identity_document"
            options={[
              { label: 'RG', value: 'rg' },
              {
                label: 'Certidão de Nascimento',
                value: 'Certidão de Nascimento'
              }
            ]}
          />
          <TextInput label="Nacionalidade" name="nationality" />
        </S.FieldsContainer>

        <Scope path="address">
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
        </Scope>
      </S.Form>
    </S.Wrapper>
  );
};

export default forwardRef(StudentForm);
