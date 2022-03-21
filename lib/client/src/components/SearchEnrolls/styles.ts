import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';

export const SearchSection = styled(SectionContent)`
  ${({ theme }) => css`
    margin-top: 2rem;
    padding: ${theme.spacings.xsmall};
  `}
`;

export const SectionTitle = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.lightSilver};
    margin-bottom: ${theme.spacings.xsmall};
  `}
`;

export const FieldsContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacings.small};
  `}
`;

export const ButtonContainer = styled.div`
  ${({ theme }) => css`
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;

    button {
      width: 16rem;

      & + button {
        margin-left: ${theme.spacings.xsmall};
      }
    }
  `}
`;
