import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  background-color: #fff;
`;

export const Navigation = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
`;

type NavItemProps = {
  active: boolean;
};
export const NavItem = styled.li<NavItemProps>`
  ${({ active, theme }) => css`
    cursor: pointer;
    padding: 1rem;
    color: #808e8e;
    background-color: #eaf0f0;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      border-right: 0.1rem solid ${theme.colors.lightSilver};
    }

    ${active &&
    css`
      border-top: 0.3rem solid ${theme.colors.secondary};
      background-color: #fff;
      border-right: 0.1rem solid ${theme.colors.lightSilver};
      color: ${theme.colors.gray};
    `}
  `}
`;

export const Content = styled.section``;
