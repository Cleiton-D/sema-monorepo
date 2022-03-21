import { useState, useRef, useEffect } from 'react';
import { Edit } from '@styled-icons/feather';
import { useAtomValue } from 'jotai/utils';

import TextInput from 'components/TextInput';

import { classroomsAtom } from 'store/atoms/create-multigrade';

type DescriptionInputProps = {
  pageType: 'new' | 'update';
  defaultValue?: string;
  disabled: boolean;
};
const DescriptionInput = ({
  pageType,
  defaultValue,
  disabled
}: DescriptionInputProps) => {
  const [description, setDescription] = useState('');
  const [customEditing, setCustomEditing] = useState(false);
  const [locked, setLocked] = useState(true);

  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const multigradeClassrooms = useAtomValue(classroomsAtom);

  const unlockDescription = () => {
    setLocked((current) => {
      if (!current) return current;
      return false;
    });
    setCustomEditing(true);
  };

  useEffect(() => {
    if (!locked) {
      descriptionInputRef.current?.focus();
    }
  }, [locked]);

  useEffect(() => {
    if (customEditing) return;
    if (pageType === 'update') return;

    const classroomsName = multigradeClassrooms
      .map(({ classroom }) => classroom.description)
      .join(' - ');

    setDescription(`Seriado: ${classroomsName}`);
  }, [multigradeClassrooms, customEditing, pageType]);

  useEffect(() => {
    if (!defaultValue) return;

    setDescription(defaultValue);
  }, [defaultValue]);

  return (
    <TextInput
      ref={descriptionInputRef}
      name="description"
      label="Nome"
      icon={<Edit size={24} title="Alterar" />}
      onBlur={() => setLocked(true)}
      onClickIcon={unlockDescription}
      disabled={locked || disabled}
      value={description}
      onChangeValue={setDescription}
    />
  );
};

export default DescriptionInput;
