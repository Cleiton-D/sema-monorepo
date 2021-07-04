import { forwardRef, useRef } from 'react';
import mergeRefs from 'react-merge-refs';

import Modal, { ModalRef } from 'components/Modal';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import Select from 'components/Select';

import { ContactFormData } from 'models/Contact';

import * as S from './styles';

type FormData = Omit<ContactFormData, 'id'>;

type AddContactModalProps = {
  onSubmit: (values: FormData) => void;
};

const AddContactModal: React.ForwardRefRenderFunction<
  ModalRef,
  AddContactModalProps
> = ({ onSubmit }, ref) => {
  const modalRef = useRef<ModalRef>(null);

  const handleBack = () => {
    modalRef.current?.closeModal();
  };

  const handleSubmit = (values: FormData) => {
    modalRef.current?.closeModal();
    onSubmit(values);
  };

  return (
    <Modal
      title="Adicionar contato"
      closeOnClickOutside={false}
      ref={mergeRefs([ref, modalRef])}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSubmit}>
          <Select
            name="type"
            label="Tipo"
            options={[
              { label: 'Telefone', value: 'phone' },
              { label: 'Email', value: 'email' }
            ]}
          />
          <TextInput name="description" label="Descrição" />
          <S.ButtonsContainer>
            <Button
              styleType="outlined"
              size="medium"
              onClick={handleBack}
              type="button"
            >
              Voltar
            </Button>
            <Button styleType="rounded" size="medium" type="submit">
              Salvar
            </Button>
          </S.ButtonsContainer>
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(AddContactModal);
