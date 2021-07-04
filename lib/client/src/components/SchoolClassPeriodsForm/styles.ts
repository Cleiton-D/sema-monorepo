import styled, { css } from 'styled-components';

import { customMedia } from 'styles/devices';

import SectionContent from 'components/SectionContent';
import * as CheckboxStyles from 'components/Checkbox/styles';
import * as TableCellStyles from 'components/TableCell/styles';

export const Wrapper = styled(SectionContent).attrs({ as: 'article' })`
  ${({ theme }) => css`
    padding: 1rem !important;
    box-shadow: ${theme.shadow.elevateCardShadow};
  `}
`;

export const TableSection = styled(SectionContent)`
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 1rem;

  ${TableCellStyles.ExpandButton} {
    color: inherit !important;
    text-decoration: none !important;

    > svg {
      display: none !important;
    }
  }
`;

export const SectionTitle = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};
  `}
`;

export const ClassPeriodsContainer = styled.ul`
  ${({ theme }) => css`
    background: #e3ecec;
    padding: ${theme.spacings.xsmall};
    list-style-type: none;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: ${theme.spacings.xsmall};

    ${customMedia.greaterThan('tabletL')`
      grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    `}

    ${CheckboxStyles.Input}:not(:checked) {
      background: ${theme.colors.white};
    }
  `}
`;
