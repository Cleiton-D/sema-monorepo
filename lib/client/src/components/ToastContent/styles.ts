import styled, { css, keyframes } from 'styled-components';
import { LoaderAlt } from '@styled-icons/boxicons-regular';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const rotateSpinner = keyframes`
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
`;

export const Spinner = styled(LoaderAlt)`
  ${({ theme }) => css`
    width: 2rem;
    margin-right: ${theme.spacings.xxsmall};
    animation: 0.7s cubic-bezier(0.645, 0.045, 0.355, 1) infinite
      ${rotateSpinner};
  `}
`;
