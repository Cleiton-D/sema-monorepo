import {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
  CSSProperties
} from 'react';
import { useField } from '@unform/core';
import mergeRefs from 'react-merge-refs';

import { masks } from 'utils/masks';

import * as S from './styles';

type InputHtmlProps =
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>;

export type InputAs = 'input' | 'textarea';

export type TextInputProps = InputHtmlProps & {
  name: string;
  label: string;
  as?: InputAs;
  size?: 'large' | 'medium' | 'small';
  type?: string;
  unformRegister?: boolean;
  icon?: React.ReactNode;
  mask?: keyof typeof masks;
  error?: string;
  containerStyle?: CSSProperties;
  onChangeValue?: (value: string) => void;
};

const TextInput: React.ForwardRefRenderFunction<
  HTMLInputElement,
  TextInputProps
> = (
  {
    as = 'input',
    size = 'large',
    name,
    label,
    value,
    icon,
    mask,
    error: errorProp,
    containerStyle,
    unformRegister = true,
    disabled = false,
    onChangeValue,
    ...rest
  },
  ref
) => {
  const [fieldValue, setFieldValue] = useState('');
  const { registerField, fieldName, error, defaultValue } = useField(name);

  const fieldRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const masked = mask ? masks[mask](value) : value;
    setFieldValue(masked);

    onChangeValue && onChangeValue(masked);
  };

  useEffect(() => {
    if (unformRegister) {
      registerField<HTMLInputElement>({
        name: fieldName,
        ref: fieldRef,
        getValue: (reference) => reference.current.value
      });
    }
  }, [registerField, fieldName, unformRegister]);

  useEffect(() => {
    if (value || defaultValue) {
      const newValue = String(value || defaultValue);
      const masked = mask ? masks[mask](newValue) : newValue;

      setFieldValue(masked);
    }
  }, [defaultValue, value, mask]);

  return (
    <S.Wrapper
      inputAs={as}
      disabled={disabled}
      style={containerStyle}
      size={size}
    >
      <S.Label hasValue={!!fieldValue} inputAs={as} isDisabled={disabled}>
        <span>{label}</span>
        <S.InputContainer size={size} hasIcon={!!icon}>
          <S.Input
            inputSize={size}
            onChange={handleChange}
            as={as}
            ref={mergeRefs([fieldRef, ref])}
            name={fieldName}
            disabled={disabled}
            value={fieldValue}
            {...rest}
          />
          {!!icon && icon}
        </S.InputContainer>
      </S.Label>
      {(!!error || !!errorProp) && (
        <S.ErrorMessage>{error || errorProp}</S.ErrorMessage>
      )}
    </S.Wrapper>
  );
};

export default forwardRef(TextInput);
