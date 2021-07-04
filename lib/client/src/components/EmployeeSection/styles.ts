import styled, { css } from 'styled-components';
import { darken } from 'polished';

export const Wrapper = styled.div``;

export const Title = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-bottom: 0.1rem solid ${theme.colors.lightSilver};
    margin-bottom: calc(${theme.spacings.xxsmall} / 2);
    padding-right: ${theme.spacings.xxsmall};

    > h2 {
      color: #7b7f80;
      font-family: ${theme.font.poppins};
      font-size: ${theme.font.sizes.medium};
      font-weight: ${theme.font.medium};
    }
  `}
`;

export const HeaderActionButton = styled.button`
  ${({ theme }) => css`
    background: none;
    border: none;
    outline: 0;
    display: flex;
    align-items: center;
    color: ${theme.colors.primary};
    font-family: ${theme.font.poppins};
    margin-bottom: 0.4rem;

    > svg {
      margin-left: 0.4rem;
      stroke-width: 2;
    }
  `}
`;

export const List = styled.ul`
  ${({ theme }) => css`
    list-style-type: none;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      height: 4rem;

      color:#7b7f80;
      font-size: 1.4rem;
      box-shadow: -0 0.1rem 0.1rem ${theme.colors.lightSilver};
      }

      & + li {
        margin-top: 0.5rem;
      }
    }
  `}
`;

export const ActionButton = styled.button`
  ${({ theme }) => css`
    background: ${theme.colors.white};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
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
    margin-top: 2rem;
    width: fit-content;
    text-align: center;
    padding: 0 1.5rem;
    font-size: ${theme.font.sizes.small};

    color: ${theme.colors.lightSilver};
    font-weight: ${theme.font.medium};
  `}
`;
