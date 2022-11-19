import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import * as InputStyles from 'components/TextInput/styles';
import * as CheckboxStyles from 'components/Checkbox/styles';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacings.xxsmall};
    padding-bottom: ${theme.spacings.small};
    width: 100%;
    min-width: 50rem;
  `}
`;

export const Form = styled(Unform)`
  ${({ theme }) => css`
    ${InputStyles.Wrapper} {
      margin-bottom: ${theme.spacings.small};

      &:last-of-type {
        margin-bottom: ${theme.spacings.large};
      }
    }

    & > ${CheckboxStyles.Wrapper} {
      justify-content: unset;
      margin-left: ${theme.spacings.xxsmall};
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

export const Divider = styled.hr`
  ${({ theme }) => css`
    margin: 1.5rem 0;
    margin-bottom: 2rem;
    width: 100%;
    appearance: none;
    content: '';
    display: block;
    box-shadow: 0rem 0rem 0rem 0.05rem ${theme.colors.lightSilver};
    border: none;
  `}
`;
