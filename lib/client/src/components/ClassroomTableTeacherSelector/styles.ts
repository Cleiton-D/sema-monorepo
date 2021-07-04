import styled, { css } from 'styled-components';

export const Wrapper = styled.select`
  ${({ theme }) => css`
    width: 100%;
    height: 2.4rem;
    outline: none;
    border: 0.1rem solid ${theme.colors.lightSilver};
    color: #545f6a;
    cursor: pointer;
  `}
`;
