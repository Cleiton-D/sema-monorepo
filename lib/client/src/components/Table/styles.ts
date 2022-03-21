import styled, { css } from 'styled-components';

type WrapperProps = {
  columnDivider: boolean;
};
export const Wrapper = styled.div<WrapperProps>`
  ${({ columnDivider, theme }) => css`
    width: 100%;
    overflow-x: auto;

    table {
      border-collapse: collapse;
      width: inherit;
      border-spacing: 0;

      ${!!columnDivider &&
      css`
        > thead > tr > th,
        > tbody > tr > td {
          &:not(:last-child) {
            border-right: 0.1rem solid ${theme.colors.lightGray};
          }
        }
      `}
    }
  `}
`;

export const TableHeader = styled.thead``;
