import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    display: grid;
    grid-template-columns: 1fr 30%;
    grid-column-gap: ${theme.spacings.medium};
  `}
`;

export const Content = styled(SectionContent)`
  ${({ theme }) => css`
    padding: ${theme.spacings.xsmall} !important;
  `}
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const GridItem = styled.div`
  ${({ theme }) => css`
    display: flex;
    font-size: ${theme.font.sizes.medium};

    > strong {
      color: #4e4e4e;
      font-weight: ${theme.font.medium};
      margin-right: ${theme.spacings.xxsmall};
    }

    > span {
      color: ${theme.colors.lightSilver};
    }
  `}
`;
