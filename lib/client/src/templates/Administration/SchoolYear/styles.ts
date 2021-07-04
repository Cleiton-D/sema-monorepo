import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';
import * as BadgeStyles from 'components/Badge/styles';

export const Wrapper = styled(SectionContent)`
  ${({ theme }) => css`
    position: relative;
    width: 100%;
    padding: ${theme.spacings.xsmall} !important;
    margin-top: ${theme.spacings.small};
  `}
`;

export const AddButtonContainer = styled.div`
  width: 20rem;
  align-self: flex-end;
`;

type GridProps = {
  rows?: number;
  columns?: number;
  gap?: number;
};
export const Grid = styled.div<GridProps>`
  ${({ rows, columns, gap }) => css`
    display: grid;
    grid-template-columns: ${columns ? `repeat(${columns}, 1fr)` : 'auto'};
    grid-template-rows: ${rows ? `repeat(${rows}, 1fr)` : 'auto'};

    ${gap &&
    css`
      gap: ${gap}px;
    `}
  `}
`;

export const GridItem = styled.article`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;

    > strong {
      color: ${theme.colors.lightSilver};
      font-weight: ${theme.font.normal};
      margin-bottom: ${theme.spacings.xxsmall};
    }

    > span:not(${BadgeStyles.Wrapper}) {
      color: #7b7f80;
    }
  `}
`;

export const SchoolTermContainer = styled.article`
  ${({ theme }) => css`
    > strong {
      display: inline-block;
      font-size: ${theme.font.sizes.medium};
      font-weight: ${theme.font.bold};
      color: #7b7f80;
      margin-bottom: ${theme.spacings.xxsmall};
    }

    > div {
      font-size: ${theme.font.sizes.small};

      > div:not(:first-child) {
        margin-top: calc(${theme.spacings.xxsmall} / 2);
      }

      strong {
        color: ${theme.colors.lightSilver};
        font-weight: ${theme.font.normal};
        margin-right: calc(${theme.spacings.xxsmall} / 2);
      }

      span {
        color: #7b7f80;
      }
    }
  `}
`;

export const Divider = styled.hr`
  ${({ theme }) => css`
    width: 90%;
    appearance: none;
    content: '';
    display: block;
    box-shadow: 0rem 0rem 0rem 0.05rem ${theme.colors.lightSilver};
    border: none;
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
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};
    padding: 2rem;
    padding-top: 1.5rem;
  `}
`;
