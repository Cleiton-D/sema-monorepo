import styled, { css } from 'styled-components';

export type ListItemProps = {
  highlightOnHover?: boolean;
};

const lisItemModifiers = {
  highlightOnHover: () => css`
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover {
      transform: translateX(0.5rem);
    }
  `
};

const ListItem = styled.li<ListItemProps>`
  ${({ theme, highlightOnHover }) => css`
    display: flex;
    align-items: center;
    height: 5rem;
    width: 100%;
    background: ${theme.colors.mainBg};
    list-style-type: none;
    padding: ${theme.spacings.xxsmall};
    border-radius: 1rem;
    box-shadow: 0rem 0rem 0.4rem #dadada;

    & + & {
      margin-top: 1.5rem;
    }

    ${!!highlightOnHover && lisItemModifiers.highlightOnHover}
  `}
`;

export default ListItem;
