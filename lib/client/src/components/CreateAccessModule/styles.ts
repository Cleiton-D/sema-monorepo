import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import * as SelectStyles from 'components/Select/styles';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacings.xxsmall};
    width: 100%;
    min-width: 50rem;
  `}
`;

export const Form = styled(Unform)`
  ${({ theme }) => css`
    ${SelectStyles.Wrapper} {
      margin-bottom: ${theme.spacings.small};
      }
    }
  `}
`;

export const CheckboxContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: ${theme.spacings.large};
  `}
`;

export const ButtonsContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: flex-end;

    button {
      width: 16rem;

      & + button {
        margin-left: ${theme.spacings.xsmall};
      }
    }
  `}
`;
