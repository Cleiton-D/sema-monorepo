import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';
import Heading from 'components/Heading';

import { customMedia } from 'styles/devices';

export const Wrapper = styled(SectionContent)`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    padding: ${theme.spacings.xsmall} !important;
  `}
`;

export const Secretary = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    max-width: 75%;
    border-bottom: 0.1rem solid ${theme.colors.lightSilver};
    margin-bottom: calc(${theme.spacings.xxsmall} / 2);
    padding: 0 ${theme.spacings.xxsmall};

    ${Heading} {
      text-transform: uppercase;
      display: block;
    }
    span {
      color: ${theme.colors.primary};
      font-weight: ${theme.font.light};
    }
  `}
`;

export const Section = styled.section`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xsmall};

    > h2 {
      color: #7b7f80;
      font-family: ${theme.font.poppins};
      font-size: ${theme.font.sizes.medium};
      font-weight: ${theme.font.medium};
    }
  `}
`;

export const EmployeesSection = styled.section`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.large};
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;

    ${customMedia.lessThan('laptopM')`
      grid-template-columns: 1fr;
    `}
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
