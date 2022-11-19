import styled, { css } from 'styled-components';

export const TableLink = styled.a`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    font: inherit;
    text-decoration: underline;
  `}
`;
