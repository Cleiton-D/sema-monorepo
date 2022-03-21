import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';
import Image from 'next/image';

import SectionContent from 'components/SectionContent';
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
    z-index: 1;
    max-width: 45rem !important;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0rem 0rem 0.5rem ${theme.colors.lightGray};
    padding-top: ${theme.spacings.small};
  `}
`;

export const Form = styled(Unform)`
  ${({ theme }) => css`
    padding: ${theme.spacings.small};
    width: 100%;
    margin-top: ${theme.spacings.xsmall};

    ${InputStyles.Wrapper} {
      margin-bottom: ${theme.spacings.xsmall};

      &:last-of-type {
        margin-bottom: ${theme.spacings.small};
      }
    }

    @media (max-width: 425px) {
      padding: ${theme.spacings.small} ${theme.spacings.xxsmall};
    }
  `}
`;
