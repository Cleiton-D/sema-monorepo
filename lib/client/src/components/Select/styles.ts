import styled, { css } from 'styled-components';
import { ChevronDown } from '@styled-icons/feather';

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

type ArrowIconProps = {
  isOpen: boolean;
};
export const ArrowIcon = styled(ChevronDown)<ArrowIconProps>`
  ${({ isOpen }) => css`
    transition: all 0.3s ease;

    ${isOpen &&
    css`
      transform: rotateZ(180deg);
    `}
  `}
`;

type OptionsListProps = {
  isOpen: boolean;
};

export const OptionsList = styled.div<OptionsListProps>`
  ${({ theme, isOpen }) => css`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 30rem;
    overflow: auto;
    background: #fdfdfd;
    padding: 1rem 0.5rem;
    padding-top: 0;
    border-radius: 0 0 0.5rem 0.5rem;
    z-index: ${theme.layers.base};
    box-shadow: 0rem 0rem 0.4rem rgba(51, 73, 77, 0.3);
    transition: all 0.2s ease-out;

    ${!isOpen &&
    css`
      visibility: hidden;
      opacity: 0;
      transform: translateY(-0.2rem);
    `}
  `}
`;

type OptionProps = {
  disabled?: boolean;
};
export const Option = styled.div<OptionProps>`
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
