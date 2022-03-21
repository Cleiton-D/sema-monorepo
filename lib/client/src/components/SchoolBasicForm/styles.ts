import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import SectionContent from 'components/SectionContent';

export const Wrapper = styled(SectionContent)`
  ${({ theme }) => css`
    margin-top: 2rem;
    padding: 1rem !important;
    box-shadow: ${theme.shadow.elevateCardShadow};
  `}
`;

export const Form = styled(Unform)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;
