import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 10mm 8mm;
  max-width: 820px;

  > * {
    font-family: 'EB Garamond', serif;
  }

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

export const Head = styled.div`
  display: flex;
  justify-content: space-between;

  > strong {
    font-size: 12px;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
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
