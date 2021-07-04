import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { FormHandles as UnformHandles } from '@unform/core';
import { PrimitiveAtom, useAtom } from 'jotai';

import TextInput from 'components/TextInput';

import { AddressFormData } from 'models/Address';
import { FormHandles } from 'models/Form';

import * as S from './styles';

type AddressFormProps = {
  jotaiState: PrimitiveAtom<AddressFormData>;
};

const AddressForm: React.ForwardRefRenderFunction<
  FormHandles,
  AddressFormProps
> = ({ jotaiState }, ref) => {
  const [state, setState] = useAtom(jotaiState);
  const formRef = useRef<UnformHandles>(null);

  const submitForm = useCallback(async () => {
    formRef.current?.submitForm();
  }, []);

  useImperativeHandle(ref, () => ({ submitForm }));

  return (
    <S.Wrapper>
      <S.SectionTitle>
        <h4>Endereço</h4>
      </S.SectionTitle>
      <S.Form
        initialData={state}
        onSubmit={(values) => setState(values)}
        ref={formRef}
      >
        <TextInput name="street" label="Logradouro" />
        <TextInput name="house_number" label="Número" />
        <TextInput name="city" label="Cidade" />
        <TextInput name="district" label="Bairro" />
        <TextInput name="region" label="Regiao" />
      </S.Form>
    </S.Wrapper>
  );
};

export default forwardRef(AddressForm);
