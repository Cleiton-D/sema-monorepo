import styled, { css } from 'styled-components';

export const FormsSection = styled.section`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.medium};
  `}
`;

export const SectionButton = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    display: flex;
    justify-content: flex-end;

    button {
      width: 17.1rem;
      height: 4.6rem;

      & + button {
        margin-left: ${theme.spacings.xsmall};
      }
    }
  `}
`;
