import styled, { css } from 'styled-components';

type WrapperProps = {
  usePadding?: boolean;
};
export const Wrapper = styled.div<WrapperProps>`
  ${({ usePadding = true }) => css`
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

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3mm;

  > strong {
    font-size: 12px;
    display: block;
  }
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
