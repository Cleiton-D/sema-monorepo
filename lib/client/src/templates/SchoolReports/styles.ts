import styled, { css } from 'styled-components';
import { Form as Unform } from '@unform/web';

import SectionContent from 'components/SectionContent';

export const Wrapper = styled(SectionContent)`
  ${({ theme }) => css`
    padding: ${theme.spacings.xsmall} !important;
    margin-top: ${theme.spacings.small};
    max-width: 60%;
  `}
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

export const Form = styled(Unform)`
  display: flex;
  flex-direction: column;
`;

export const TableSection = styled(SectionContent)`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 1rem;
`;

export const SectionTitle = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};
    padding: 2rem;
    padding-top: 1.5rem;
  `}
`;

type InputContainerProps = {
  isDisabled: boolean;
  message?: string;
};
export const InputContainer = styled.div<InputContainerProps>`
  ${({ theme, isDisabled, message }) =>
    isDisabled &&
    css`
      cursor: pointer;
      position: relative;

      &:hover {
        ::before,
        ::after {
          opacity: 0.8;
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

export const ButtonContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    margin-right: ${theme.spacings.xxsmall};
    width: 15rem;
    align-self: flex-end;
  `}
`;
