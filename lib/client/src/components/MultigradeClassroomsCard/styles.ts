import styled, { css } from 'styled-components';
import { darken } from 'polished';

import SectionContent from 'components/SectionContent';

export const Wrapper = styled(SectionContent).attrs({ as: 'article' })`
  ${({ theme }) => css`
    padding: 1rem 1.5rem !important;
    box-shadow: ${theme.shadow.elevateCardShadow};
    height: 100%;
  `}
`;

export const Section = styled(SectionContent)`
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 1rem;
  height: 100%;
`;

export const SectionTitle = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;

    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};

    > button {
      width: 15rem;
    }
  `}
`;

export const ListSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const List = styled.ul`
  list-style-type: none;
  margin-top: 2rem;
`;

export const ItemContent = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding-left: 1rem;
    padding-right: 1rem;
    color: ${theme.colors.black};

    > div {
      display: flex;
      align-items: center;

      button + button {
        margin-left: 1rem;
      }
    }
  `}
`;

export const Message = styled.p`
  ${({ theme }) => css`
    display: block;
    margin: 0 auto;
    margin-top: 4rem;
    width: fit-content;
    text-align: center;
    padding: 0 2rem;

    color: ${theme.colors.lightSilver};
    font-weight: ${theme.font.medium};
  `}
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
    color: ${theme.colors.red};
    padding: 0.4rem;
    transition: background 0.3s ease;

    &:hover {
      background: ${darken(0.05, theme.colors.white)};
    }
  `}
`;
