import styled, { css } from 'styled-components';

import * as ButtonStyles from 'components/Button/styles';
import { customMedia } from 'styles/devices';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    width: 100%;
    min-width: 50rem;
    padding-bottom: ${theme.spacings.xxsmall};
  `}
`;

export const FieldsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  ${customMedia.lessThan('tabletS')`
    grid-template-columns: 1fr;
  `}
`;

export const ButtonContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: flex-end;
    margin-top: ${theme.spacings.small};

    ${ButtonStyles.Wrapper} {
      width: 17.1rem;
    }
  `}
`;
