import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';
import * as DatepickerStyles from 'components/Datepicker/styles';

import { customMedia } from 'styles/devices';

export const Wrapper = styled(SectionContent).attrs({ as: 'article' })`
  ${({ theme }) => css`
    padding: 1rem !important;
    box-shadow: ${theme.shadow.elevateCardShadow};
  `}
`;

export const BasicContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
    padding-top: ${theme.spacings.xxsmall};

    ${DatepickerStyles.Wrapper} {
      grid-row: 2;
    }

    ${customMedia.lessThan('tabletS')`
      grid-template-columns: 1fr;

      ${DatepickerStyles.Wrapper} {
        grid-row: auto;
      }
    `};
  `}
`;

export const TermPeriodsContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    padding-top: ${theme.spacings.xxsmall};
    border-top: 1px solid ${theme.colors.lightGray};

    > section {
      margin-top: ${theme.spacings.xxsmall};
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-row-gap: 3rem;

      ${customMedia.lessThan('tabletL')`
        grid-template-columns: 1fr;
      `}
    }
  `}
`;

export const SectionTitle = styled.strong`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};
  `}
`;

export const TermPeriod = styled.fieldset`
  ${({ theme }) => css`
    border: none;
    padding: ${theme.spacings.xxsmall};

    :nth-child(odd) {
      border-right: 1px solid ${theme.colors.lightGray};

      ${customMedia.lessThan('tabletL')`
        border-right: none;
      `}
    }

    legend {
      color: ${theme.colors.lightSilver};
      font-size: ${theme.font.sizes.small};
      margin-left: calc(${theme.spacings.xxsmall} / 2);
      padding: 0 calc(${theme.spacings.xxsmall} / 2);
    }
  `}
`;

export const TermPeriodFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  ${customMedia.lessThan('tabletS')`
    grid-template-columns: 1fr;
  `}
`;

export const ButtonsContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.medium};
    display: flex;
    justify-content: flex-end;

    button {
      width: 18rem;

      & + button {
        margin-left: ${theme.spacings.xsmall};
      }
    }
  `}
`;
