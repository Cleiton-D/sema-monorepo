import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';
import media from 'styled-media-query';

import SectionContent from 'components/SectionContent';

import { customMedia } from 'styles/devices';

export const Wrapper = styled(SectionContent).attrs({ as: 'article' })`
  ${({ theme }) => css`
    padding: 1.5rem !important;
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
  margin-top: 2.4rem;
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  grid-row-gap: 2.5rem;

  ${media.lessThan('large')`
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  `}
`;

export const EmployeesSection = styled.section`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;

    ${customMedia.lessThan('laptopM')`
      grid-template-columns: 1fr;
    `}
  `}
`;
