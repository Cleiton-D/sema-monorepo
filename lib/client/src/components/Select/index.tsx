import { useEffect, useRef, useCallback } from 'react';
import { useField } from '@unform/core';

import UnregisteredSelect, {
  UnregisteredSelectRef
} from 'components/UnregisteredSelect';

export type Option = {
  label: string;
  value: any;
};

export type OptionGroup = {
  title: string;
  items: Option[];
};

type SelectProps = {
  label: string;
  name: string;
  options?: Array<Option | OptionGroup>;
  selectedOption?: any;
  emptyOption?: boolean;
  onChange?: (value?: any) => void;
  className?: string;
  disabled?: boolean;
};

export type Orientation = 'bottom' | 'top';

const Select = ({
  name,
  label,
  options = [],
  selectedOption,
  className,
  emptyOption = false,
  disabled = false,
  onChange
}: SelectProps) => {
  const selectedOptionValue = useRef<Option | undefined>(undefined);
  const unregisteredSelectRef = useRef<UnregisteredSelectRef>(null);

  const { defaultValue, fieldName, registerField, error } = useField(name);

  const setValue = useCallback((value: any) => {
    console.log(value);
    selectedOptionValue.current = value;
    unregisteredSelectRef.current?.setValue(value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectedOptionValue,
      getValue: (ref) => ref.current,
      setValue: (_, value) => setValue(value)
    });
  }, [registerField, fieldName, setValue]);

  useEffect(() => {
    selectedOptionValue.current = selectedOption || defaultValue;
  }, [selectedOption, defaultValue]);

  const handleChange = (value: any) => {
    selectedOptionValue.current = value;
    onChange && onChange(value);
  };

  return (
    <UnregisteredSelect
      name={name}
      label={label}
      options={options}
      selectedOption={selectedOption}
      className={className}
      emptyOption={emptyOption}
      disabled={disabled}
      error={error}
      defaultValue={defaultValue}
      onChange={handleChange}
      ref={unregisteredSelectRef}
    />
  );
};

export default Select;
