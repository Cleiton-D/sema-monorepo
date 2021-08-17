import styled, { css } from 'styled-components';

export const Text = styled.p`
  ${({ theme }) => css`
    display: block;
    margin: 0 auto;
    margin-top: 15%;

    display: block;
    width: fit-content;
    text-align: center;
    padding: 0 2rem;

    color: ${theme.colors.lightSilver};
    font-size: ${theme.font.sizes.xlarge};
    font-weight: ${theme.font.medium};

    a {
      color: ${theme.colors.primary};
      font: inherit;
      text-decoration: underline;
    }
  `}
`;
