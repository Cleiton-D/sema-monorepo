import styled, { css } from 'styled-components';

export const Wrapper = styled.main`
  ${({ theme }) => css`
    display: grid;
    grid-template-areas:
      'sidebar header'
      'sidebar main-content';
    grid-template-columns: 29rem 1fr;
    grid-template-rows: 8rem 1fr;
    grid-row-gap: 0.2rem;
    width: 100vw;
    height: 100vh;
    background: ${theme.colors.mainBg};
  `}
`;

export const Content = styled.section`
  ${({ theme }) => css`
    grid-area: main-content;
    padding: ${theme.spacings.small};
    overflow-y: auto;
  `}
`;
