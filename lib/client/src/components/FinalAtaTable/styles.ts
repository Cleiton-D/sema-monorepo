import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    th,
    td {
      &:not(:last-child) {
        border-right: 1px solid ${theme.colors.lightGray};
      }
    }
  `}
`;
