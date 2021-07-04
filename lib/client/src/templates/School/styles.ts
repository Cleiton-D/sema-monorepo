import styled, { css } from 'styled-components';

import Heading from 'components/Heading';
import SectionContent from 'components/SectionContent';
import { customMedia } from 'styles/devices';

export const Wrapper = styled(SectionContent)`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xsmall};
    padding: ${theme.spacings.xsmall} !important;
  `}
`;

export const AddButtonContainer = styled.div`
  width: 20rem;
  align-self: flex-end;
`;

export const LightText = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    font-weight: ${theme.font.light};
  `}
`;

export const SchoolName = styled(Heading)`
  text-transform: uppercase;
`;

export const Details = styled.article`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.large};
  `}
`;

type GridProps = {
  rows?: number;
};
export const Grid = styled.div<GridProps>`
  ${({ rows }) => css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    grid-template-rows: ${rows ? `repeat(${rows}, 1fr)` : 'auto'};
    grid-gap: 2rem;
  `}
`;

export const GridItem = styled.article`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    font-size: ${theme.font.sizes.small};

    > strong {
      color: ${theme.colors.lightSilver};
      font-weight: ${theme.font.normal};
      margin-bottom: ${theme.spacings.xxsmall};
    }

    > span {
      color: #7b7f80;
    }
  `}
`;

export const LinkGridItem = styled(GridItem)`
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
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

export const Divider = styled.hr`
  ${({ theme }) => css`
    width: 75%;
    appearance: none;
    content: '';
    display: block;
    box-shadow: 0rem 0rem 0rem 0.05rem ${theme.colors.lightSilver};
    border: none;
  `}
`;

export const SectionTitle = styled.div`
  ${({ theme }) => css`
    h1 {
      font-size: ${theme.font.sizes.large};
      font-weight: ${theme.font.bold};
      color: ${theme.colors.lightSilver};
    }
  `}
`;

export const AdminTitle = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 75%;
    border-bottom: 0.1rem solid ${theme.colors.lightSilver};
    margin-bottom: calc(${theme.spacings.xxsmall} / 2);
    padding-right: ${theme.spacings.xxsmall};

    > h2 {
      color: #7b7f80;
      font-family: ${theme.font.poppins};
      font-size: ${theme.font.sizes.medium};
      font-weight: ${theme.font.medium};
    }
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

export const EmployeesSection = styled.section`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;

    ${customMedia.lessThan('laptopM')`
      grid-template-columns: 1fr;
    `}
  `}
`;
