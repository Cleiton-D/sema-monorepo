import styled, { css, DefaultTheme } from 'styled-components';
import { PlusCircle, Trash2 } from '@styled-icons/feather';

export const Wrapper = styled.section`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xsmall};
    padding: ${theme.spacings.xsmall} !important;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
    grid-gap: ${theme.spacings.medium};
  `}
`;

export const ImageMessage = styled.span`
  ${({ theme }) => css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    height: 5rem;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: ${theme.colors.white};
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.poppins};

    transform: translateY(100%);
    transition: transform 0.3s ease;
  `}
`;

type CardItemProps = {
  isCurrent: boolean;
};

const cardItemsModifiers = {
  isCurrent: (theme: DefaultTheme) => css`
    border: 0.3rem solid ${theme.colors.secondary};
  `
};
export const CardItem = styled.article<CardItemProps>`
  ${({ theme, isCurrent }) => css`
    position: relative;
    justify-self: center;
    display: flex;
    flex-direction: column;
    height: 13.3rem;
    width: 25rem;
    background: ${theme.colors.white};
    box-shadow: 0rem 0rem 0.4rem rgba(51, 73, 77, 0.3);
    border-radius: 0.5rem;
    cursor: pointer;

    ${isCurrent && cardItemsModifiers.isCurrent(theme)}
  `}
`;

export const ImageContainer = styled.button`
  outline: 0;
  border: none;
  background: transparent;
  width: 100%;
  height: 100%;
  border-radius: 0.3rem;

  overflow: hidden;
  position: relative;

  &:hover ${ImageMessage} {
    transform: translateY(0);
  }
`;

export const CheckContainer = styled.div`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;

    background: ${theme.colors.secondary};
    border-radius: 50%;
    z-index: ${theme.layers.base};
    transform: translate(-1rem, -1rem);

    > svg {
      color: ${theme.colors.white};
      stroke-width: 3;
    }
  `}
`;

export const AddImageButton = styled.label`
  ${({ theme }) => css`
    outline: 0;
    border: none;
    background: transparent;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem;
    border: 0.3rem dashed ${theme.colors.lightSilver};
    cursor: pointer;

    > input {
      display: none;
    }
  `}
`;

export const PlusIcon = styled(PlusCircle).attrs({
  size: 52
})`
  ${({ theme }) => css`
    color: ${theme.colors.lightSilver};
    stroke-width: 1.5;
  `}
`;

export const DeleteButton = styled.button`
  ${({ theme }) => css`
    outline: 0;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.2rem;
    height: 3.2rem;

    background: ${theme.colors.red};
    border-radius: 50%;
    z-index: ${theme.layers.base};
    transform: translate(1.2rem, -1.2rem);

    > svg {
    }
  `}
`;

export const TrashIcon = styled(Trash2).attrs({
  size: 20
})`
  ${({ theme }) => css`
    color: ${theme.colors.white};
    stroke-width: 3;
  `}
`;
