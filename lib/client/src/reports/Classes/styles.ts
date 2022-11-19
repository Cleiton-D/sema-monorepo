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

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 0 2mm;
`;

export const Table = styled.table`
  width: 100%;

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

export const Summary = styled.div`
  margin-top: 5mm;
  border: 1px solid #000;
  max-width: 410px;

  @media print {
    page-break-inside: avoid;

    &.pad * {
      page-break-after: avoid;
      page-break-before: avoid;
    }

    &.page {
      page-break-after: always;
      page-break-inside: avoid;
    }
  }
`;

export const SummaryTitle = styled.strong`
  display: flex;
  border-bottom: 1px solid #000;
  align-items: center;
  justify-content: center;
`;

export const SummaryBody = styled.div`
  padding: 2mm;
`;

export const SummaryClasses = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SignBox = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-top: 6mm;

  > span {
    border-top: 1px solid #000;
    display: flex;
    justify-content: center;
  }
`;
