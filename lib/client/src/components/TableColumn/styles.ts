import styled, { css, DefaultTheme } from 'styled-components';
import { darken } from 'polished';

import { TableColumnProps } from './';

export const columnFixedModifier = (
  theme: DefaultTheme,
  position?: number
) => css`
  position: sticky;
  z-index: ${theme.layers.base};
  left: ${position ? `${position}px` : 0};
`;

export const wrapperModifiers = {
  minimal: (theme: DefaultTheme) => css`
    font-size: ${theme.font.sizes.xsmall};
    color: #545f6a;
    background: #e3ecec;
    border-bottom: 0;
    box-shadow: none;
  `
};

type WrapperProps = {
  position?: number;
  minimal: boolean;
} & Pick<TableColumnProps, 'fixed' | 'contentAlign'>;

export const Wrapper = styled.th<WrapperProps>`
  ${({ theme, fixed, position, minimal, contentAlign }) => css`
    border-bottom: 0.2rem solid ${theme.colors.lightSilver};
    box-shadow: 0 0.23rem 0.1rem -0.1rem ${darken(0.2, theme.colors.lightSilver)};

    text-align: ${contentAlign};
    color: ${theme.colors.gray};
    font-weight: ${theme.font.normal};
    font-size: ${theme.font.sizes.medium};
    padding: ${theme.spacings.xxsmall} ${theme.spacings.xsmall};
    white-space: nowrap;
    background: ${theme.colors.white};

    ${!!fixed && columnFixedModifier(theme, position)}
    ${!!minimal && wrapperModifiers.minimal(theme)}
  `}
`;
