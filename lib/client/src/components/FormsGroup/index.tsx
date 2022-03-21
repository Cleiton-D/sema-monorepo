import React, { Children, useState, cloneElement, useMemo } from 'react';

import Button from 'components/Button';

import { FormHandles } from 'models/Form';

import * as S from './styles';

type FormsGroupProps = {
  children: React.ReactElement[];
  finishButtonText?: string;
  onFinish?: () => void;
};

const FormsGroup = ({
  children,
  finishButtonText = 'Finalizar',
  onFinish
}: FormsGroupProps) => {
  const [saving, setSaving] = useState(false);
  const [refs, setRefs] = useState<FormHandles[]>([]);

  const withRefItems = useMemo(
    () =>
      Children.map(children, (item: any, index) => {
        const setRef = (value: any) => {
          if (item.ref) item.ref.current = value;

          setRefs((current) => {
            const currentItems = [...current];
            currentItems.splice(index, 1, value);
            return [...currentItems];
          });
        };

        const clonedElement = cloneElement(item, {
          ...item.props,
          ref: setRef
        });

        return clonedElement;
      }),
    [children]
  );

  const handleFinish = async () => {
    setSaving(true);

    const promises = refs.map(
      (ref) =>
        new Promise((resolve) => {
          ref
            ?.submitForm()
            .then(() => resolve(true))

            .catch((err) => {
              console.error('could not send data, ', err);
              resolve(false);
            });
        })
    );

    const resolved = await Promise.all(promises);
    const failed = resolved.some((item) => !item);

    if (!failed) {
      onFinish && onFinish();
    }

    setSaving(false);
  };

  return (
    <S.Wrapper>
      <S.ItemsContainer>{withRefItems}</S.ItemsContainer>

      <S.SectionButton>
        <Button styleType="rounded" onClick={handleFinish}>
          {saving ? 'Salvando...' : finishButtonText}
        </Button>
      </S.SectionButton>
    </S.Wrapper>
  );
};

export default FormsGroup;
