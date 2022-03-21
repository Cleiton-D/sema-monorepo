import styled, { css } from 'styled-components';
import { darken } from 'polished';

export const List = styled.ul`
  list-style-type: none;
  margin-top: 2rem;
`;

export const ItemContent = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding-left: 1rem;
    padding-right: 1rem;
    color: ${theme.colors.black};
  `}
`;

export const ActionButton = styled.button`
  ${({ theme }) => css`
    background: ${theme.colors.white};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 3rem;
    border: 0;
    outline: 0;
    stroke-width: 2;
    color: ${theme.colors.red};
    padding: 0.4rem;
    transition: background 0.3s ease;

    &:hover {
      background: ${darken(0.05, theme.colors.white)};
    }
  `}
`;

export const Message = styled.p`
  ${({ theme }) => css`
    display: block;
    margin: 0 auto;
    margin-top: 4rem;
    width: fit-content;
    text-align: center;
    padding: 0 2rem;

    color: ${theme.colors.lightSilver};
    font-weight: ${theme.font.medium};
  `}
`;
