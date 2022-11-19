import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  padding: 2rem;
  padding-top: 0.5rem;
`;

export const Header = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: ${theme.layers.base + 1};
  `}
`;

export const LightLink = styled.a`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.primary};
    text-decoration: none;
  `}
`;

export const TableSection = styled(SectionContent)`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 1rem;
`;

export const PaginatorContainer = styled.div`
  padding: 2rem 3rem;
`;
