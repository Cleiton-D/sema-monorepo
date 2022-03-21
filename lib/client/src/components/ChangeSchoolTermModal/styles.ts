import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacings.xxsmall};
    width: 100%;
    min-width: 50rem;
  `}
`;

export const Form = styled(Unform)``;

export const FieldsContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: ${theme.spacings.small};
  `}
`;

export const ButtonsContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.medium};
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
