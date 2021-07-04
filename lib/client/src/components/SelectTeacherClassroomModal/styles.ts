import styled, { css } from 'styled-components';

import * as InputStyles from 'components/TextInput/styles';
import * as SelectStyles from 'components/Select/styles';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacings.xxsmall};
    padding-bottom: ${theme.spacings.xsmall};
    width: 100%;
    min-width: 50rem;

    ${InputStyles.Wrapper}, ${SelectStyles.Wrapper} {
      margin-bottom: ${theme.spacings.large};
    }
  `}
`;

export const ButtonsContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: flex-end;

    button {
      width: 15rem;

      & + button {
        margin-left: ${theme.spacings.xsmall};
      }
    }
  `}
`;
