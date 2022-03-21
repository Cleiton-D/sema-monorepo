import styled, { css } from 'styled-components';

export const LightText = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    font-weight: ${theme.font.light};
  `}
`;

export const Content = styled.div`
  margin-top: 4rem;
`;
