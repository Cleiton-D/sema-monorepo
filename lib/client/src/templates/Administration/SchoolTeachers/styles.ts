import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';
import Li from 'components/ListItem';

export const Content = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.medium};
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 3rem;
  `}
`;

export const Wrapper = styled(SectionContent).attrs({ as: 'article' })`
  ${({ theme }) => css`
    padding: 1rem 1.5rem !important;
    box-shadow: ${theme.shadow.elevateCardShadow};
  `}
`;

export const Section = styled(SectionContent)`
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 1rem;
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

export const List = styled.ul`
  list-style-type: none;
  margin-top: 2rem;
`;

type ListItemProps = {
  selected?: boolean;
};
export const ListItem = styled(Li)<ListItemProps>`
  ${({ theme, selected }) => css`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
    ${
      selected &&
      css`
        z-index: ${theme.layers.modal};
        position: relative;
        transform: translateX(0.5rem);
        background: ${theme.colors.white};
      `
    }}
  `}
`;

type TeachersContainerProps = {
  active: boolean;
};
export const TeachersContainer = styled.div<TeachersContainerProps>`
  ${({ theme, active }) => css`
    display: flex;
    flex-direction: column;
    height: 100%;

    ${active &&
    css`
      z-index: ${theme.layers.modal};
    `}
  `}
`;

type OverlayProps = {
  active?: boolean;
};
export const Overlay = styled.div<OverlayProps>`
  ${({ theme, active }) => css`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: ${theme.layers.overlay};
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease-out;
    cursor: pointer;

    ${active &&
    css`
      visibility: visible;
      opacity: 1;
    `}
  `}
`;
