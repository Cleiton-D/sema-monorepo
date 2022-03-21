import styled, { css } from 'styled-components';
import { Loader, Search } from '@styled-icons/feather';

import { Orientation } from '.';

export const Wrapper = styled.div`
  position: relative;
  height: 5rem;
  width: 100%;
  cursor: pointer;

  label,
  input {
    cursor: pointer;
  }

  input {
    color: #556365;
  }
`;

export const LoaderIcon = styled(Loader)`
  /* transition: all 0.3s ease; */
  /* transform: rotateZ(180deg); */
`;

export const SearchIcon = styled(Search)``;

const optionsListModifiers = {
  bottom: () => css`
    top: 100%;
    border-radius: 0 0 0.5rem 0.5rem;
  `,
  top: () => css`
    bottom: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
  `
};

type OptionsListProps = {
  isOpen: boolean;
  orientation: Orientation;
};

const slideOut = (orientation: Orientation) => css`
  @keyframes SlideOut {
    from {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
    to {
      visibility: hidden;
      opacity: 0;
      transform: ${orientation === 'top'
        ? 'translateY(0.2rem)'
        : 'translateY(-0.2rem)'};
    }
  }
`;

const slideIn = (orientation: Orientation) => css`
  @keyframes SlideIn {
    from {
      visibility: hidden;
      opacity: 0;

      transform: ${orientation === 'top'
        ? 'translateY(0.2rem)'
        : 'translateY(-0.2rem)'};
    }
    to {
      visibility: visible;
      opacity: 1;

      transform: translateY(0);
    }
  }
`;

export const OptionsList = styled.div<OptionsListProps>`
  ${({ theme, isOpen, orientation }) => css`
    ${slideIn(orientation)}
    ${slideOut(orientation)}

    position: absolute;
    left: 0;
    right: 0;
    overflow: auto;
    background: #fdfdfd;
    padding: 1rem 0.5rem;
    padding-top: 0;
    z-index: ${theme.layers.base};
    box-shadow: 0rem 0rem 0.4rem rgba(51, 73, 77, 0.3);
    max-height: 0;
    visibility: hidden;
    opacity: 0;

    transform: ${orientation === 'top'
      ? 'translateY(0.2rem)'
      : 'translateY(-0.2rem)'};

    animation-duration: 0.2s;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
    animation-name: ${isOpen ? 'SlideIn' : 'SlideOut'};

    ${optionsListModifiers[orientation]};
  `}
`;

type OptionItemProps = {
  disabled?: boolean;
};
const OptionItem = styled.div<OptionItemProps>`
  ${({ disabled }) => css`
    padding: 1rem;
    margin-top: 1rem;
    color: #556365;
    height: 100%;

    ${disabled &&
    css`
      pointer-events: none;
      cursor: not-allowed;
    `}

    :hover {
      background: #f5f5f5;
    }
  `}
`;

export const EmptyOption = styled(OptionItem)`
  padding: 0;
  margin-top: 0.5rem;
`;

type GroupContainerProps = {
  hasTitle: boolean;
};
export const GroupContainer = styled.div<GroupContainerProps>`
  ${({ theme, hasTitle }) => css`
    position: relative;

    ${hasTitle &&
    css`
      margin-top: 1.5rem;
      border-top: 0.1rem solid ${theme.colors.lightSilver};

      > span {
        position: absolute;
        top: 0;
        padding: 0 0.5rem;
        transform: translateY(calc(-50% - 0.1rem));
        background: ${theme.colors.white};
        font-size: ${theme.font.sizes.small};
        color: ${theme.colors.lightSilver};
      }
    `}
  `}
`;

export const Option = styled(OptionItem)`
  ${EmptyOption} + ${GroupContainer} > & {
    margin-top: 0;
  }
`;
