import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';

export const Wrapper = styled(SectionContent)`
  ${({ theme }) => css`
    padding: ${theme.spacings.small} !important;
    margin-top: ${theme.spacings.xxlarge};
    margin-bottom: calc(2 * ${theme.spacings.xxlarge});
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

export const BackButtonContainer = styled.div`
  width: 15rem;
  align-self: flex-end;
`;
