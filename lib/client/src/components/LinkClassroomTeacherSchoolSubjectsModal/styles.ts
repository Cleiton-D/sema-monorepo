import styled, { css } from 'styled-components';

import { customMedia } from '../../styles/devices';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacings.xxsmall};
    padding-bottom: ${theme.spacings.xsmall};
    width: 100%;
    min-width: min(70rem, calc(100vw - 6rem));
  `}
`;

export const FieldsContainer = styled.div`
  ${({ theme }) => css`
    margin-top: 2.4rem;
    margin-bottom: 1.5rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    grid-row-gap: 2.5rem;
    margin-bottom: ${theme.spacings.large};

    ${customMedia.lessThan('tablet')`
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    `}
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
