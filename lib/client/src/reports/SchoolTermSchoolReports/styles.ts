import styled, { css } from 'styled-components';

type WrapperProps = {
  usePadding: boolean;
};
export const Wrapper = styled.div<WrapperProps>`
  ${({ usePadding }) => css`
    max-width: 820px;

    ${usePadding &&
    css`
      padding: 10mm 8mm;
    `}

    > * {
      font-family: 'EB Garamond', serif;
    }
  `}
`;

export const Table = styled.table`
  &,
  th,
  td {
    border: 1px solid #000;
    border-collapse: collapse;
    font-size: 12px;
  }

  td {
    padding: 0 2px;
  }
`;

export const HeadRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SchoolSubjectTitleCell = styled.th`
  padding-top: 1mm;
  padding-bottom: 1mm;

  > span {
    transform: rotateZ(180deg);
    writing-mode: vertical-rl;
  }
`;
