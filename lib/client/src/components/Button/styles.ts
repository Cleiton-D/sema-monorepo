import styled, { css, DefaultTheme } from 'styled-components';
import { darken } from 'polished';

import { ButtonProps } from './';

export type WrapperProps = {
  hasIcon: boolean;
} & Pick<ButtonProps, 'size' | 'fullWidth' | 'styleType'>;

const wrapperModifiers = {
  small: (theme: DefaultTheme) => css`
    height: 3rem;
    font-size: ${theme.font.sizes.xsmall};
    font-weight: ${theme.font.medium};
  `,
  medium: (theme: DefaultTheme) => css`
    height: 4rem;
    font-size: ${theme.font.sizes.small};
    padding: ${theme.spacings.xxsmall};
  `,
  large: (theme: DefaultTheme) => css`
    height: 5rem;
    font-size: ${theme.font.sizes.large};
    padding: ${theme.spacings.xxsmall};
  `,
  fullWidth: () => css`
    width: 100%;
  `,
  withIcon: (theme: DefaultTheme) => css`
    svg {
      width: 2rem;
      stroke-width: 2;

      & + span {
        margin-left: ${theme.spacings.xxsmall};
      }
    }
  `,
  disabled: () => css`
    &:disabled {
      cursor: not-allowed;
      filter: saturate(30%);
    }
  `,
  normal: () => css``,
  rounded: () => css`
    border-radius: 10rem;
  `,
  outlined: (theme: DefaultTheme) => css`
    background: ${theme.colors.white};
    box-sizing: border-box;
    border: 0.2rem solid ${theme.colors.primary};
    color: ${theme.colors.primary};
    font-weight: ${theme.font.bold};
    border-radius: 10rem;

    &:hover {
      background: ${theme.colors.white};
    }
  `
};

export const Wrapper = styled.button<WrapperProps>`
  ${({ theme, size, fullWidth, hasIcon, disabled, styleType }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: 0;
    outline: none;
    border-radius: 0.6rem;
    padding: ${theme.spacings.xxsmall};
    text-decoration: none;
    cursor: pointer;
    font-family: ${theme.font.poppins};
    font-weight: ${theme.font.bold};
    transition: background 0.3s ease;
    width: 100%;

    &:hover {
      background: ${darken(0.05, theme.colors.primary)};
    }

    ${!!styleType && wrapperModifiers[styleType](theme)}
    ${!!fullWidth && wrapperModifiers.fullWidth()}
    ${!!size && wrapperModifiers[size](theme)}
      ${!!hasIcon && wrapperModifiers.withIcon(theme)}
      ${disabled && wrapperModifiers.disabled()};
  `}
`;
