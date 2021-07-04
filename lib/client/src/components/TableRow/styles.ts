import styled, { css, DefaultTheme } from 'styled-components';

type WrapperProps = {
  disabledItem: boolean;
};

export const Wrapper = styled.tr<WrapperProps>`
  ${({ disabledItem }) =>
    disabledItem &&
    css`
      opacity: 0.5;
    `}
`;

const detailLineModifiers = {
  active: (theme: DefaultTheme) => css`
    > td > div {
      border-left: 5px solid ${theme.colors.secondary};
      visibility: visible;
      max-height: 40rem;
    }
  `
};

type DetailLineProps = {
  active: boolean;
};
export const DetailLine = styled.tr<DetailLineProps>`
  ${({ active, theme }) => css`
    > td {
      > div {
        border: none;
        border-color: ${theme.colors.secondary};
        visibility: hidden;
        overflow: auto;
        max-height: 0rem;
        transition: all 0.3s ease-out;
      }
    }

    ${!!active && detailLineModifiers.active(theme)}
  `}
`;
