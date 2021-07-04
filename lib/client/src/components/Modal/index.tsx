import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';

import * as S from './styles';

type ModalProps = {
  children: React.ReactNode;
  title?: React.ReactNode;
  closeOnClickOutside?: boolean;
};

export type ModalRef = {
  openModal: () => void;
  closeModal: () => void;
};

const Modal: React.ForwardRefRenderFunction<ModalRef, ModalProps> = (
  { children, title, closeOnClickOutside = true },
  ref
) => {
  const [show, setShow] = useState(false);

  const openModal = useCallback(() => {
    setShow(true);
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
  }, []);

  const handleClickOutside = () => {
    if (closeOnClickOutside) {
      setShow(false);
    }
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal
  }));

  if (!show) return null;
  return (
    <>
      <S.Wrapper>
        {title && <S.Title>{title}</S.Title>}
        <S.Content>{children}</S.Content>
      </S.Wrapper>
      <S.Overlay onClick={handleClickOutside} />
    </>
  );
};

export default forwardRef(Modal);
