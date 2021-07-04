import styled, { css, DefaultTheme } from 'styled-components';

import { BadgeProps } from './';

export type WrapperProps = Pick<BadgeProps, 'styledType'>;

const wrapperModifiers = {
  green: (theme: DefaultTheme) => css`
    border: 0.1rem solid ${theme.colors.secondary};
    color: ${theme.colors.secondary};
  `,
  blue: (theme: DefaultTheme) => css`
    border: 0.1rem solid ${theme.colors.primary};
    color: ${theme.colors.primary};
  `,
  orange: (theme: DefaultTheme) => css`
    background: ${theme.colors.yellow};
    color: #50605c;
  `,
  red: (theme: DefaultTheme) => css`
    background: ${theme.colors.red};
    color: ${theme.colors.white};
  `
};

export const Wrapper = styled.span<WrapperProps>`
  ${({ theme, styledType }) => css`
    display: inline-block;
    padding: 0.8rem 2rem;
    font-size: ${theme.font.sizes.medium};
    font-weight: ${theme.font.normal};
    font-style: normal;
    line-height: 1rem;
    text-align: center;
    max-width: min-content;
    border-radius: 10rem;

    ${wrapperModifiers[styledType](theme)}
  `}
`;
