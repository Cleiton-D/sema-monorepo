import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import SectionContent from 'components/SectionContent';

export const Wrapper = styled(SectionContent).attrs({ as: 'article' })`
  ${({ theme }) => css`
    padding: 1rem !important;
    box-shadow: ${theme.shadow.elevateCardShadow};
  `}
`;

export const SectionTitle = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};
  `}
`;

export const InputContainer = styled.div``;

export const Form = styled(Unform)`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xsmall};
    margin-bottom: 1.5rem;
  `}
`;
