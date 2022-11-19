import styled, { css } from 'styled-components';

export const CalendarWrapper = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xlarge};
    display: grid;
    grid-template-columns: repeat(auto-fill, 30rem);
    gap: ${theme.spacings.large};
    justify-content: space-around;
  `}
`;

export const LightText = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    font-weight: ${theme.font.light};
  `}
`;
