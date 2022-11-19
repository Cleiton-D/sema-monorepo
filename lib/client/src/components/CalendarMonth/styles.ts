import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    justify-self: center;
    background: ${theme.colors.white};
    box-shadow: 0px 0px 4px rgba(51, 73, 77, 0.3);
    border-radius: ${theme.border.radius};
    padding: ${theme.spacings.xxsmall};
  `}
`;

export const Title = styled.h3`
  ${({ theme }) => css`
    text-transform: capitalize;
    color: ${theme.colors.black};
    font-weight: ${theme.font.light};
  `}
`;

export const Table = styled.table`
  ${({ theme }) => css`
    table-layout: fixed;
    border-collapse: collapse;

    td,
    th {
      padding: 0.5rem;
    }

    th {
      color: ${theme.colors.black};
      font-weight: 500;
    }
  `}
`;
