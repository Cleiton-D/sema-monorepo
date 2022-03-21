import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';
import media from 'styled-media-query';

import SectionContent from 'components/SectionContent';

import * as CheckboxStyles from 'components/Checkbox/styles';

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

export const Form = styled(Unform)`
  margin-bottom: 1.5rem;
`;

export const FieldsContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xsmall};
    margin-bottom: ${theme.spacings.small};
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 2rem;
    grid-row-gap: ${theme.spacings.small};

    ${media.lessThan('large')`
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, 1fr);
    `}
  `}
`;

export const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  grid-column: 1/3;
  padding-left: 1rem;

  ${CheckboxStyles.Wrapper} {
    justify-content: flex-start;
  }
`;

export const AutocompleteContainer = styled.div`
  grid-column: 1/3;
`;
