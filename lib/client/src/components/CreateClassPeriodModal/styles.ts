import styled, { css } from 'styled-components';

import { customMedia } from 'styles/devices';

import * as ButtonStyles from 'components/Button/styles';
import * as SelectStyles from 'components/Select/styles';
import * as CheckboxStyles from 'components/Checkbox/styles';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    width: 100%;
    min-width: 50rem;
    padding-bottom: ${theme.spacings.xxsmall};
  `}
`;

export const FieldsContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    ${customMedia.lessThan('tabletS')`
    grid-template-columns: 1fr;
  `}

    & > ${SelectStyles.Wrapper} {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    & > ${CheckboxStyles.Wrapper} {
      justify-content: unset;
      margin-left: ${theme.spacings.xxsmall};
    }
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

export const Divider = styled.hr`
  ${({ theme }) => css`
    grid-column: 1/3;
    width: 100%;
    appearance: none;
    content: '';
    display: block;
    box-shadow: 0rem 0rem 0rem 0.05rem ${theme.colors.lightSilver};
    border: none;
  `}
`;
