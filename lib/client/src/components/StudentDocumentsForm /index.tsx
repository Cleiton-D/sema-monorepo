import { forwardRef, useRef, useCallback, useImperativeHandle } from 'react';
import { PrimitiveAtom, useAtom } from 'jotai';
import { FormHandles as UnformHandles } from '@unform/core';
import { ValidationError } from 'yup';

import TextInput from 'components/TextInput';

import { FormHandles } from 'models/Form';
import { EnrollDocumentsFormData } from 'models/Enroll';

import { studentDocumentsSchema } from './rules/schema';

import * as S from './styles';

type StudentDocumentsFormProps = {
  jotaiState: PrimitiveAtom<EnrollDocumentsFormData>;
};

const StudentDocumentsForm: React.ForwardRefRenderFunction<
  FormHandles,
  StudentDocumentsFormProps
> = ({ jotaiState }, ref) => {
  const [state, setState] = useAtom(jotaiState);

  const formRef = useRef<UnformHandles>(null);

  const handleSubmit = useCallback(
    async (values: EnrollDocumentsFormData) => {
      try {
        formRef.current?.setErrors({});

        await studentDocumentsSchema.validate(values, { abortEarly: false });
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
    const values = formRef.current?.getData() as EnrollDocumentsFormData;
    await handleSubmit(values);
  }, [handleSubmit]);

  useImperativeHandle(ref, () => ({ submitForm }));

  return (
    <S.Wrapper>
      <S.SectionTitle>
        <h4>Documentos</h4>
      </S.SectionTitle>
      <S.Form
        onSubmit={(values) => console.log(values)}
        initialData={state}
        ref={formRef}
      >
        <TextInput label="CPF" name="cpf" />
        <TextInput label="RG" name="rg" />
        <TextInput label="NIS" name="nis" />
        <TextInput label="Cert. Nascimento" name="birth_certificate" />
      </S.Form>
    </S.Wrapper>
  );
};

export default forwardRef(StudentDocumentsForm);
