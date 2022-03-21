import styled, { css } from 'styled-components';
import { darken } from 'polished';

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

export const Message = styled.p`
  ${({ theme }) => css`
    display: block;
    margin: 4rem auto;

    display: block;
    width: fit-content;
    text-align: center;
    padding: 0 2rem;

    color: ${theme.colors.lightSilver};
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.medium};

    a {
      color: ${theme.colors.primary};
      font: inherit;
      text-decoration: underline;
    }
  `}
`;

export const ActionButton = styled.button`
  ${({ theme }) => css`
    position: relative;
    background: ${theme.colors.white};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 3rem;
    border: 0;
    outline: 0;
    stroke-width: 2;
    color: ${theme.colors.red};
    padding: 0.4rem;
    transition: background 0.3s ease;

    &:first-child {
      margin-right: 1rem;
    }

    &:hover {
      background: ${darken(0.05, theme.colors.white)};
    }
  `}
`;
