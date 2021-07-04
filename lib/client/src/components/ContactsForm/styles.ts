import styled, { css } from 'styled-components';
import media from 'styled-media-query';
import { darken } from 'polished';

import SectionContent from 'components/SectionContent';
import ListItem from 'components/ListItem';

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

export const ContactsList = styled.ul`
  margin-top: 2.4rem;
  margin-bottom: 2rem;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  ${media.lessThan('large')`
    grid-template-columns: 1fr;
  `}
`;

export const ContactItem = styled(ListItem)`
  ${({ theme }) => css`
    margin: 0 !important;
    padding-right: 1.5rem !important;
    justify-content: space-between;

    > div {
      display: flex;

      strong {
        color: ${theme.colors.lightSilver};
        margin-right: 0.5rem;
      }

      span {
        color: ${theme.colors.silver};
      }

      div + div {
        margin-left: 3rem;
      }
    }
  `}
`;

export const AddNewItem = styled(ListItem)`
  ${({ theme }) => css`
    margin: 0 !important;
    border-radius: 5px !important;
    box-shadow: none !important;
    background-color: #fff !important;

    border: dashed 0.1rem ${theme.colors.lightSilver};
    padding-left: 1rem;
    cursor: pointer;
    color: ${theme.colors.silver};

    svg {
      margin-right: 0.5rem;
      stroke-width: 2;
    }
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
