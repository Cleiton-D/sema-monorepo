import styled, { css, keyframes } from 'styled-components';

const showModal = keyframes`
  from {
    visibility: hidden;
    opacity: 0;
    transform: translateX(-50%) translateY(calc(-50% + -0.5rem));
  }
  to {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(-50%);
  }
`;

export const Wrapper = styled.div`
  ${({ theme }) => css`
    visibility: hidden;
    opacity: 0;
    animation: 0.3s ease-out ${showModal};
    animation-fill-mode: forwards;

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-0.5rem);
    z-index: ${theme.layers.modal};
    background: red;
    padding: ${theme.spacings.xxsmall} ${theme.spacings.xsmall};
    border-radius: 1rem;
    background ${theme.colors.white};
  `}
`;

export const Title = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};
  `}
`;

export const Content = styled.div`
  ${({ theme }) => css`
    padding-top: ${theme.spacings.xsmall};
  `}
`;

const showOverlay = keyframes`
  from {
    visibility: hidden;
    opacity: 0;
  }
  to {
    visibility: visible;
    opacity: 1;
  }
`;

export const Overlay = styled.div`
  ${({ theme }) => css`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: ${theme.layers.overlay};

    visibility: hidden;
    opacity: 0;
    animation: 0.3s ease-out ${showOverlay};
    animation-fill-mode: forwards;
  `}
`;
