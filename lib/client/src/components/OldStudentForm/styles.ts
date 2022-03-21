import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';
import * as CheckboxStyles from 'components/Checkbox/styles';

export const Wrapper = styled(SectionContent).attrs({ as: 'article' })`
  ${({ theme }) => css`
    padding: 1.5rem 1rem !important;
    box-shadow: ${theme.shadow.elevateCardShadow};
  `}
`;

export const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1rem;

  ${CheckboxStyles.Wrapper} {
    justify-content: flex-start;
  }
`;

export const AutoCompleteContainer = styled.div`
  margin-top: 2rem;
`;
