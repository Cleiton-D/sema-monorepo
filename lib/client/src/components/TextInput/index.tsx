import {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
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
  onClickIcon?: () => void;
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
    onClickIcon,
    ...rest
  },
  ref
) => {
  const [fieldValue, setFieldValue] = useState('');
  const { registerField, fieldName, error, defaultValue } = useField(name);

  const fieldRef = useRef<HTMLInputElement>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;

    const masked = mask ? masks[mask](value) : value;
    setFieldValue(masked);

    onChangeValue && onChangeValue(masked);
  };

  const setValue = useCallback(
    (value?: string) => {
      setFieldValue(() => {
        if (value === undefined) return '';
        const newValue = String(value || '');
        const masked = mask ? masks[mask](newValue) : newValue;
        return masked;
      });
    },
    [mask]
  );

  useEffect(() => {
    if (unformRegister) {
      registerField<string>({
        name: fieldName,
        ref: fieldRef,
        getValue: (reference) => reference.current.value,
        setValue: (_, value) => setValue(value)
      });
    }
  }, [registerField, fieldName, unformRegister, setValue]);

  useEffect(() => {
    const valueIsUndefined = typeof value === 'undefined';
    const defaultIsUndefined = typeof defaultValue === 'undefined';

    if (!valueIsUndefined || !defaultIsUndefined) {
      const newVlue = valueIsUndefined ? defaultValue : value;
      setValue(newVlue);
    } else {
      setValue(undefined);
    }
  }, [defaultValue, setValue, value]);

  useEffect(() => {
    if (fieldRef.current) {
      fieldRef.current.value = fieldValue;
    }
  }, [fieldValue]);

  return (
    <S.Wrapper
      inputAs={as}
      disabled={disabled}
      style={containerStyle}
      size={size}
    >
      <S.Container hasClickableIcon={!!icon && !!onClickIcon}>
        <S.Label hasValue={!!fieldValue} inputAs={as} isDisabled={disabled}>
          <span>{label}</span>
          <S.InputContainer size={size} hasIcon={!!icon}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <S.Input
              inputSize={size}
              onChange={handleChange}
              as={as}
              ref={mergeRefs([fieldRef, ref])}
              name={fieldName}
              disabled={disabled}
              // value={fieldValue}
              {...rest}
            />
            {!!icon && !onClickIcon && <>{icon}</>}
          </S.InputContainer>
        </S.Label>
        {!!icon && !!onClickIcon && (
          <S.IconButton onClick={onClickIcon}>{icon}</S.IconButton>
        )}
      </S.Container>
      {(!!error || !!errorProp) && (
        <S.ErrorMessage>{error || errorProp}</S.ErrorMessage>
      )}
    </S.Wrapper>
  );
};

export default forwardRef(TextInput);
