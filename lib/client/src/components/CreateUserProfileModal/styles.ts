import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import * as SelectStyles from 'components/Select/styles';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacings.xxsmall};
    padding-bottom: ${theme.spacings.xsmall};
    width: 100%;
    min-width: 50rem;
  `}
`;

export const Form = styled(Unform)`
  ${({ theme }) => css`
    ${SelectStyles.Wrapper} {
      margin-bottom: ${theme.spacings.small};
    }
  `}
`;

export const ButtonsContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: flex-end;
    margin-top: ${theme.spacings.large};

    button {
      width: 15rem;

      & + button {
        margin-left: ${theme.spacings.xsmall};
      }
    }
  `}
`;
