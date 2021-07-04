import styled, { css } from 'styled-components';

import * as CardStyles from 'components/Card/styles';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
    grid-gap: ${theme.spacings.medium};

    ${CardStyles.Wrapper} {
      justify-self: center;
    }
  `}
`;
