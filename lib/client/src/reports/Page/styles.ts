import styled, { css } from 'styled-components';

type WrapperProps = {
  orientation?: 'landscape' | 'portrait';
};

const wrapperModifiers = {
  portrait: () => css`
    width: inherit;
    height: inherit;

    @media print {
      break-inside: avoid;
      break-after: always;

      page-break-inside: avoid;
      page-break-after: always;

      &.pad * {
        break-after: always;
        break-before: avoid;

        page-break-after: always;
        page-break-before: avoid;
      }

      &.page {
        break-after: always;
        break-before: avoid;

        page-break-after: always;
        page-break-inside: avoid;
      }
    }
  `,
  landscape: () => css`
    /* transform-origin: center center;
    transform: rotateZ(-90deg) translateY(44mm) translateX(-43mm);
    width: 210mm;
    height: 296mm; */

    @media print {
      break-inside: right;
      break-after: always;

      page-break-inside: right;
      page-break-after: always;

      &.pad * {
        break-after: right;
        break-before: avoid;

        page-break-after: right;
        page-break-before: avoid;
      }

      &.page {
        break-after: right;
        break-before: avoid;

        page-break-after: right;
        page-break-inside: avoid;
      }
    }
  `
};
export const Wrapper = styled.main<WrapperProps>`
  ${({ orientation = 'portrait' }) => css`
    ${wrapperModifiers[orientation]}

    padding: 15mm;

    > * {
      font-family: 'EB Garamond', serif;
    }

    /* @media print {
      break-inside: avoid;
      break-after: always;

      page-break-inside: avoid;
      page-break-after: always;

      &.pad * {
        break-after: always;
        break-before: avoid;

        page-break-after: always;
        page-break-before: avoid;
      }

      &.page {
        break-after: always;
        break-before: avoid;

        page-break-after: always;
        page-break-inside: avoid;
      }
    } */
  `}
`;
