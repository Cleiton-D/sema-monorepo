import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import { customMedia } from 'styles/devices';

import SectionContent from 'components/SectionContent';

export const Content = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.medium};
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 3rem;
  `}
`;

export const Wrapper = styled(SectionContent).attrs({ as: 'article' })`
  ${({ theme }) => css`
    padding: 1rem 1.5rem !important;
    box-shadow: ${theme.shadow.elevateCardShadow};
  `}
`;

export const ClassroomsContainer = styled.div`
  ${({ theme }) => css`
    z-index: ${theme.layers.modal};
    display: flex;
    flex-direction: column;
    height: 100%;
  `}
`;

export const Form = styled(Unform)`
  ${({ theme }) => css`
    > :not(:last-child) {
      margin-bottom: ${theme.spacings.xsmall};
    }
  `}
`;

export const ButtonContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: flex-end;

    margin-top: ${theme.spacings.small};

    ${customMedia.greaterThan('tablet')`
      > button {
        width: 20rem;
      }
    `}
  `}
`;

export const FinishButtonContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.medium};
    display: flex;
    justify-content: flex-end;

    button {
      width: 24rem;
      height: 4.6rem;
    }
  `}
`;
