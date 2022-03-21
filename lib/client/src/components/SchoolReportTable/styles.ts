import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    th,
    td {
      :nth-child(3),
      :nth-child(5),
      :nth-child(6),
      :nth-child(8),
      :nth-child(10) {
        border-right: 0.1rem solid ${theme.colors.lightSilver};
      }
    }
  `}
`;
