import styled, { css } from 'styled-components';

export const Wrapper = styled.header`
  ${({ theme }) => css`
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${theme.spacings.medium};
    background: #fdfdfd;
    box-shadow: 0rem 0.1rem 0.1rem #dbe8ea;
  `}
`;

export const ProfileContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    font-family: ${theme.font.inter};
    font-size: ${theme.font.sizes.medium};
    height: 100%;

    > span {
      font-weight: ${theme.font.normal};
      color: ${theme.colors.lightSilver};
      margin-right: ${theme.spacings.xxsmall};
    }
  `}
`;
