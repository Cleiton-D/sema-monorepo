import styled, { css, DefaultTheme } from 'styled-components';

export const Wrapper = styled.aside`
  ${({ theme }) => css`
    grid-area: sidebar;
    display: grid;
    grid-template-areas:
      'logo'
      'menu';
    grid-template-rows: 8rem 1fr;
    background: ${theme.colors.white};
    box-shadow: 0.2rem 0rem 0.5rem rgba(218, 222, 236, 0.5);
    text-align: center;
  `}
`;

export const Logo = styled.a`
  grid-area: logo;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -0.05rem 0rem 0rem 0.05rem #a6c4c9;
`;

export const Menu = styled.ul`
  ${({ theme }) => css`
    padding-top: ${theme.spacings.small};
    list-style-type: none;
  `}
`;

const menuItemModifiers = {
  active: (theme: DefaultTheme) => css`
    a {
      background: ${theme.colors.mainBg};

      border-left: 0.5rem solid ${theme.colors.secondary};
      padding-left: ${theme.spacings.xxsmall};
      box-shadow: inset 0.15rem 0.1rem 0.1rem -0.05rem #ccdbdb,
        inset 0.1rem -0.1rem 0.15rem -0.05rem #ccdbdb;
    }
  `
};

type MenuItemProps = {
  active?: boolean;
};
export const MenuItem = styled.li<MenuItemProps>`
  ${({ theme, active }) => css`
    height: 4.5rem;

    & + & {
      margin-top: 0.1rem;
    }

    a {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: ${theme.spacings.xsmall};
      text-decoration: none;
      color: ${theme.colors.black};
      transition: background 0.2s ease;
    }

    ${!active &&
    css`
      &:hover a {
        background: ${theme.colors.mainBg};
      }
    `}

    ${!!active && menuItemModifiers.active(theme)}
  `}
`;
