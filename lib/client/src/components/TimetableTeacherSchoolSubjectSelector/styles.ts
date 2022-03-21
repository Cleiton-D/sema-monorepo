import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  box-shadow: 0px 0px 4px rgba(51, 73, 77, 0.3);
  border-radius: 0.4rem;
  padding: 0.5rem;
`;

export const InputContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;

    select {
      width: 100%;
      height: 2.4rem;
      outline: none;
      border: 0.1rem solid ${theme.colors.lightSilver};
      color: #545f6a;
      cursor: pointer;
    }
  `}
`;
