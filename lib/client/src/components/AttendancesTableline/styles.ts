import styled, { css } from 'styled-components';

import TableRow from 'components/TableRow';
import * as CheckboxStyles from 'components/Checkbox/styles';

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

        ${CheckboxStyles.Input} {
          &:checked {
            background-color: #989c9f;
          }
          border-color: #989c9f;
        }
      }
    `}
`;
