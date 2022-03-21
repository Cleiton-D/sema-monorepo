import styled, { css } from 'styled-components';

type InputContainerProps = {
  isDisabled: boolean;
  message?: string;
};
export const InputContainer = styled.div<InputContainerProps>`
  ${({ theme, isDisabled, message }) =>
    isDisabled &&
    !!message &&
    css`
      cursor: pointer;
      position: relative;

      &:hover {
        ::before,
        ::after {
          opacity: 1;
          visibility: visible;
        }
      }

      ::before,
      ::after {
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
      }

      ::before {
        content: '${message}';
        position: absolute;
        width: max-content;
        transform: translateY(calc(-100% - 0.6rem));
        background: ${theme.colors.lightSilver};
        box-shadow: 0rem 0.3rem 0.6rem rgba(0, 0, 0, 0.2);
        color: ${theme.colors.white};
        font-size: ${theme.font.sizes.xsmall};
        padding: calc(${theme.spacings.xxsmall} / 2) ${theme.spacings.xxsmall};
        border-radius: 0.5rem;
      }

      ::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        left: calc(${theme.spacings.xxsmall} / 2);
        top: -0.2rem;
        transform: translateY(-100%);
        border-style: solid;
        border-width: 0.5rem 0.5rem 0 0.5rem;
        border-color: #97aeb1 transparent transparent transparent;
      }
    `}
`;
