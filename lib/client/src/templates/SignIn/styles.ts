import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import SectionContent from 'components/SectionContent';
import * as InputStyles from 'components/TextInput/styles';

export const Wrapper = styled.main`
  ${({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: ${theme.colors.mainBg};
  `}
`;

export const Content = styled(SectionContent)`
  ${({ theme }) => css`
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
    background: ${theme.colors.white};
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
