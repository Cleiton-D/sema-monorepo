import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';
import Heading from 'components/Heading';

export const Wrapper = styled(SectionContent)`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xsmall};
    padding: ${theme.spacings.xsmall} !important;
  `}
`;

export const LightText = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    font-weight: ${theme.font.light};
  `}
`;

export const ClassroomDescription = styled(Heading)`
  text-transform: uppercase;
`;

export const Details = styled.article`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.large};
  `}
`;

type GridProps = {
  rows?: number;
};
export const Grid = styled.div<GridProps>`
  ${({ rows }) => css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    grid-template-rows: ${rows ? `repeat(${rows}, 1fr)` : 'auto'};
    grid-gap: 2rem;
  `}
`;

export const GridItem = styled.article`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    font-size: ${theme.font.sizes.small};

    > strong {
      color: ${theme.colors.lightSilver};
      font-weight: ${theme.font.normal};
      margin-bottom: ${theme.spacings.xxsmall};
    }

    > span {
      color: #7b7f80;
    }
  `}
`;

export const TableSection = styled(SectionContent)`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.medium};
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 1rem;
  `}
`;

export const SectionTitle = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};
    padding: 2rem;
    padding-top: 1.5rem;
  `}
`;

export const LightLink = styled.a`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.primary};
    text-decoration: none;
  `}
`;
