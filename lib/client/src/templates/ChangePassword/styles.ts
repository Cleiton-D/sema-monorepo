import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';
import Image from 'next/image';

import SectionContent from 'components/SectionContent';
import Heading from 'components/Heading';

import * as InputStyles from 'components/TextInput/styles';

export const Background = styled(Image)`
  z-index: 0;
  filter: brightness(80%) contrast(120%) !important;
`;

type WrapperProps = {
  hasBackground: boolean;
};
export const Wrapper = styled.main<WrapperProps>`
  ${({ theme, hasBackground }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: ${theme.colors.mainBg};
    color: ${theme.colors.gray};

    ${hasBackground &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
        box-shadow: inset 0rem 0rem 15rem rgba(0, 0, 15, 1);
      }
    `}
  `}
`;

export const Content = styled(SectionContent)`
  ${({ theme }) => css`
    @keyframes show-in {
      from {
        transform: scale(0.99);
      }
      to {
        transform: scale(1);
      }
    }

    z-index: 1;
    max-width: 55rem !important;
    display: flex;
    flex-direction: column;
    align-items: center;

    animation: 0.3s ease-out 0.05s show-in;
    animation-fill-mode: forwards;

    padding: ${theme.spacings.small} !important;
    padding-top: ${theme.spacings.xxsmall};

    ${Heading} {
      margin-bottom: ${theme.spacings.xsmall};
    }
  `}
`;

export const UserContent = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: ${theme.spacings.small};

    span {
      color: ${theme.colors.silver};
    }
  `}
`;

export const UserImageContainer = styled.div`
  ${({ theme }) => css`
    width: 8rem;
    height: 8rem;
    position: relative;
    border-radius: 50%;
    box-shadow: 0rem 0rem 0.2rem ${theme.colors.gray};

    img {
      border-radius: 50%;
    }
  `}
`;

export const Form = styled(Unform)`
  ${({ theme }) => css`
    width: 100%;
    margin-top: ${theme.spacings.small};

    ${InputStyles.Wrapper} {
      margin-bottom: ${theme.spacings.small};

      &:last-of-type {
        margin-bottom: ${theme.spacings.large};
      }
    }
  `}
`;
