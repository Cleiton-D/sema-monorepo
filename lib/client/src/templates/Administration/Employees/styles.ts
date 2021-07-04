import styled, { css } from 'styled-components';

import SectionContent from 'components/SectionContent';

export const TableSection = styled(SectionContent)`
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

export const AddButtonContainer = styled.div`
  width: 25rem;
  align-self: flex-end;
`;
