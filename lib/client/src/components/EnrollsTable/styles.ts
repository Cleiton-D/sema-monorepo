import styled, { css } from 'styled-components';
import { darken } from 'polished';

export const TableLink = styled.a`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    font: inherit;
    text-decoration: underline;
  `}
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActionButton = styled.button`
  ${({ theme }) => css`
    background: ${theme.colors.white};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 3rem;
    border: 0;
    outline: 0;
    stroke-width: 2;
    padding: 0.4rem;
    transition: background 0.3s ease;
    &:hover {
      background: ${darken(0.05, theme.colors.white)};
    }

    &:not(:last-child) {
      margin-right: ${theme.spacings.xxsmall};
    }
  `}
`;
