import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import SectionContent from 'components/SectionContent';

export const Wrapper = styled(SectionContent)`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    padding: ${theme.spacings.xsmall} !important;
    width: 80%;
  `}
`;

export const Form = styled(Unform)`
  display: flex;
  flex-direction: column;
  width: 95%;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;

export const GridItem = styled.div`
  ${({ theme }) => css`
    display: flex;
    font-size: ${theme.font.sizes.medium};

    > strong {
      color: #4e4e4e;
      font-weight: ${theme.font.medium};
      margin-right: ${theme.spacings.xxsmall};
    }

    > span {
      color: ${theme.colors.lightSilver};
    }
  `}
`;

export const Divider = styled.hr`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    width: 90%;
    appearance: none;
    content: '';
    display: block;
    box-shadow: 0rem 0rem 0rem 0.05rem ${theme.colors.lightSilver};
    border: none;
  `}
`;

export const InputContent = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xsmall};

    > strong {
      display: inline-block;
      color: #4e4e4e;
      font-size: ${theme.font.sizes.large};
      font-weight: ${theme.font.bold};
      margin-bottom: ${theme.spacings.xxsmall};
    }
  `}
`;

export const SaveButtonContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    width: 20rem;
    align-self: flex-end;
  `}
`;
