import styled, { css } from 'styled-components';
import { darken } from 'polished';

import SectionContent from 'components/SectionContent';

export const AddButtonContainer = styled.div`
  width: 25rem;
  align-self: flex-end;
`;

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

export const TableLink = styled.a`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    font: inherit;
    text-decoration: underline;
  `}
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActionButton = styled.button`
  ${({ theme }) => css`
    background: ${theme.colors.white};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 3rem;
    border: 0;
    outline: 0;
    stroke-width: 2;
    padding: 0.4rem;
    transition: background 0.3s ease;
    color: ${theme.colors.red};

    &:hover {
      background: ${darken(0.05, theme.colors.white)};
    }

    &:not(:last-child) {
      margin-right: ${theme.spacings.xxsmall};
    }
  `}
`;

export const PaginatorContainer = styled.div`
  padding: 2rem 3rem;
`;
