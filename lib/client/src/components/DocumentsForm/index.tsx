import { forwardRef, useRef, useCallback, useImperativeHandle } from 'react';
import { PrimitiveAtom, useAtom } from 'jotai';
import { FormHandles as UnformHandles } from '@unform/core';
import { ValidationError } from 'yup';

import TextInput from 'components/TextInput';

import { PersonDocumentsForm } from 'models/PersonDocuments';
import { FormHandles } from 'models/Form';

import { documentsSchema } from './rules/schema';

import * as S from './styles';

type DocumentsFormProps = {
  jotaiState: PrimitiveAtom<PersonDocumentsForm>;
};

const DocumentsForm: React.ForwardRefRenderFunction<
  FormHandles,
  DocumentsFormProps
> = ({ jotaiState }, ref) => {
  const [state, setState] = useAtom(jotaiState);

  const formRef = useRef<UnformHandles>(null);

  const handleSubmit = useCallback(
    async (values: PersonDocumentsForm) => {
      try {
        formRef.current?.setErrors({});

        await documentsSchema.validate(values, { abortEarly: false });
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
    const values = formRef.current?.getData() as PersonDocumentsForm;
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
        <TextInput label="CPF" name="CPF" />
        <TextInput label="RG" name="RG" />
        <TextInput label="PIS / PASEP" name="pis_pasep" />
      </S.Form>
    </S.Wrapper>
  );
};

export default forwardRef(DocumentsForm);
