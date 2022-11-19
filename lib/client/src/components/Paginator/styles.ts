import styled, { css } from 'styled-components';
import media from 'styled-media-query';

import * as SelectStyles from 'components/UnregisteredSelect/styles';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;

    ${media.lessThan('large')`
      display: grid;
      grid-template-columns: 1fr;
      row-gap: ${theme.spacings.small};
    `}
  `}
`;

export const PageItemsContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    width: fit-content;
    border: 0.1rem solid ${theme.colors.lightSilver};
    border-radius: 0.5rem;
    overflow: hidden;
  `}
`;

type PageItemProps = {
  isActive: boolean;
};
export const PageItem = styled.button<PageItemProps>`
  ${({ theme, isActive }) => css`
    height: 4rem;
    border: none;
    margin: 0;
    width: auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${theme.font.poppins};
    outline: 0;

    background: ${theme.colors.white};
    color: ${theme.colors.primary};

    ${isActive &&
    css`
      background: ${theme.colors.primary};
      color: ${theme.colors.white};
    `}

    &:not(:last-child) {
      border-right: 0.1rem solid ${theme.colors.lightSilver};
    }

    &:disabled {
      color: ${theme.colors.lightGray};
    }
  `}
`;

export const SizeContainer = styled.div`
  display: flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 1rem;
  }

  ${SelectStyles.Wrapper} {
    width: unset;
    height: unset;
  }
`;

export const SizeText = styled.span`
  ${({ theme }) => css`
    font-size: 1.4rem;
    color: ${theme.colors.silver};
  `}
`;
