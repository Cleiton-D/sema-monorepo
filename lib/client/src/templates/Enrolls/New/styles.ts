import styled, { css } from 'styled-components';

export const FormsSection = styled.section`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.medium};

    > *:not(:first-child) {
      margin-top: ${theme.spacings.medium};
    }
  `}
`;
