import { useEffect, useRef, useState, useCallback } from 'react';
import { useField } from '@unform/core';

import TextInput from 'components/TextInput';

import * as S from './styles';

export type Option = {
  label: string;
  value: any;
};

type SelectProps = {
  label: string;
  name: string;
  options?: Option[];
  selectedOption?: any;
  emptyOption?: boolean;
  onChange?: (value?: any) => void;
  className?: string;
  disabled?: boolean;
};

const Select = ({
  name,
  label,
  options = [],
  selectedOption: selectedItem,
  className,
  emptyOption = false,
  disabled = false,
  onChange
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>();

  const selectedOptionValue = useRef<Option | undefined>(undefined);

  const { defaultValue, fieldName, registerField, error } = useField(name);

  const handleChange = (option?: Option) => {
    setSelectedOption(option);
    selectedOptionValue.current = option?.value;
    onChange && onChange(option?.value);
  };

  const setValue = useCallback(
    (value?: any) => {
      const option = options.find((option) => option.value === value);
      setSelectedOption(option);
      selectedOptionValue.current = option ? value : undefined;
    },
    [options]
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectedOptionValue,
      getValue: (ref) => ref.current,
      setValue: (_, value) => setValue(value)
    });
  }, [registerField, fieldName, selectedOption, setValue]);

  useEffect(() => {
    if (defaultValue || selectedItem) {
      setValue(defaultValue || selectedItem);
    }
  }, [defaultValue, setValue, selectedItem]);

  return (
    <S.Wrapper className={className}>
      <TextInput
        name={name}
        label={label}
        unformRegister={false}
        readOnly
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        value={selectedOption?.label}
        icon={<S.ArrowIcon isOpen={open} />}
        error={error}
        disabled={disabled}
      />
      <S.OptionsList isOpen={open}>
        {emptyOption && (
          <S.Option onClick={() => handleChange(undefined)} disabled={disabled}>
            &nbsp;
          </S.Option>
        )}
        {options.map((option) => (
          <S.Option
            key={`${option.label}-${JSON.stringify(option.value)}`}
            onClick={() => handleChange(option)}
            disabled={disabled}
          >
            {option.label}
          </S.Option>
        ))}
      </S.OptionsList>
    </S.Wrapper>
  );
};

export default Select;
