import styled, { css } from 'styled-components';
import { CheckboxProps } from '.';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type InputProps = Pick<CheckboxProps, 'inactive'>;

export const Input = styled.input<InputProps>`
  ${({ theme, inactive }) => css`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    width: 1.8rem;
    height: 1.8rem;
    border: 0.1rem solid ${theme.colors.primary};
    border-radius: 0.5rem;
    position: relative;
    outline: none;
    transition: all 0.2s ease-out;

    ${inactive &&
    css`
      border: 0.1rem solid ${theme.colors.lightGray};
    `}

    &::before {
      transition: transform 0.3s ease, opacity 0.2s;
      content: '';
      width: 0.6rem;
      height: 0.9rem;
      border: 0.2rem solid ${theme.colors.white};
      border-top: 0;
      border-left: 0;
      position: absolute;
      top: 0.1rem;
      transform: rotate(20deg);
      opacity: 0;
    }

    &:focus {
      box-shadow: 0 0 0.1rem ${theme.colors.primary};
    }

    &:checked {
      background: ${theme.colors.primary};
      border-width: 0.3rem;

      &::before {
        transition: transform 0.6s cubic-bezier(0.2, 0.85, 0.32, 1.2),
          opacity 0.3s;

        opacity: 1;
        transform: rotate(43deg);
      }
    }
    &:disabled {
      opacity: 0.6;
    }
  `}
`;

export const Label = styled.label<Pick<CheckboxProps, 'labelColor'>>`
  ${({ theme, labelColor }) => css`
    cursor: pointer;
    padding-left: ${theme.spacings.xxsmall};
    color: ${theme.colors[labelColor!]};
    line-height: 1.8rem;
  `}
`;
