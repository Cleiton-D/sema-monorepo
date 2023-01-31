import styled, { css } from 'styled-components';
import { darken } from 'polished';

import SectionContent from 'components/SectionContent';

export const TableSection = styled(SectionContent)`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xlarge};
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

export const PaginatorContainer = styled.div`
  padding: 2rem 3rem;
`;

export const ActionButton = styled.a`
  ${({ theme }) => css`
    display: flex;
    text-decoration: none;
    background: ${theme.colors.white};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    border: 0;
    outline: 0;
    stroke-width: 2;
    color: ${theme.colors.primary};
    margin: 0 auto;
    padding: 0.4rem;

    &:hover {
      background: ${darken(0.05, theme.colors.white)};
    }
  `}
`;
