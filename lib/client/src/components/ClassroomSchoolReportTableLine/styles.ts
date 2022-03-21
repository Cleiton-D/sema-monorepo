import styled, { css } from 'styled-components';

import TableRow from 'components/TableRow';

type WrapperProps = {
  isActive: boolean;
};
export const Wrapper = styled(TableRow)<WrapperProps>`
  ${({ isActive, theme }) =>
    !isActive &&
    css`
      td {
        background-color: ${theme.colors.mainBg};
        color: #989c9f;
      }
    `}
`;
