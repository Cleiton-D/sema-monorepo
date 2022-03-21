import {
  GlobalStyleComponent,
  DefaultTheme,
  createGlobalStyle,
  css
} from 'styled-components';

import fonts from './fonts';

type GlobalStyleProps = {
  i?: string;
};

const GlobalStyles: GlobalStyleComponent<
  GlobalStyleProps,
  DefaultTheme
> = createGlobalStyle`

  ${fonts.map(
    (font) => css`
      @font-face {
        font-family: ${font.name};
        font-style: ${font.style};
        font-weight: ${font.weight};
        font-display: ${font.display};
        src: local(''), url('${font.url}') format('${font.format}');
      }
    `
  )}


  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    &::before, &::after {
      box-sizing: inherit;
    }
  }

  html {
    font-size: 62.5%;
  }

  body {
    ${({ theme }) => css`
      font-family: ${theme.font.poppins};
      font-size: 1.6rem;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    `}
  }

  button {
    cursor: pointer;
  }
`;

export default GlobalStyles;
