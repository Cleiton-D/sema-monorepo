import styled, { css } from 'styled-components';

export const SectionContent = styled.section`
  ${({ theme }) => css`
    max-width: 100%;
    background: ${theme.colors.white};
    padding: 0.5rem;
    border-radius: 1rem;
  `}
`;

export default SectionContent;
