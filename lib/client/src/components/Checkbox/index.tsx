import { useState, InputHTMLAttributes, useEffect } from 'react';

import * as S from './styles';

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  onCheck?: (status: boolean) => void;
  isChecked?: boolean;
  label?: string;
  labelFor?: string;
  labelColor?: 'white' | 'black';
  value?: string | ReadonlyArray<string> | number;
  inactive?: boolean;
};

const Checkbox = ({
  onCheck,
  isChecked,
  label,
  labelFor,
  labelColor,
  value,
  disabled,
  inactive = false,
  ...props
}: CheckboxProps) => {
  const [checked, setChecked] = useState(!!isChecked);

  const onChange = () => {
    setChecked((status) => {
      const newStatus = !status;

      !!onCheck && onCheck(newStatus);
      return newStatus;
    });
  };

  useEffect(() => {
    setChecked(!!isChecked);
  }, [isChecked]);

  return (
    <S.Wrapper>
      <S.Input
        id={labelFor}
        type="checkbox"
        onChange={onChange}
        checked={checked}
        value={value}
        disabled={disabled}
        inactive={inactive}
        {...props}
      />
      {!!label && (
        <S.Label htmlFor={labelFor} labelColor={labelColor}>
          {label}
        </S.Label>
      )}
    </S.Wrapper>
  );
};

export default Checkbox;
