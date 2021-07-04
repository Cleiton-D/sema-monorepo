import {
  GlobalStyleComponent,
  DefaultTheme,
  createGlobalStyle,
  css
} from 'styled-components';

type GlobalStyleProps = {
  i?: string;
};

const GlobalStyles: GlobalStyleComponent<
  GlobalStyleProps,
  DefaultTheme
> = createGlobalStyle`

  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 300;
    src: local(''),
        url('/fonts/poppins/poppins-v15-latin-300.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Poppins';
    font-style: italic;
    font-weight: 300;
    src: local(''),
        url('/fonts/poppins/poppins-v15-latin-300italic.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    src: local(''),
        url('/fonts/poppins/poppins-v15-latin-regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Poppins';
    font-style: italic;
    font-weight: 400;
    src: local(''),
        url('/fonts/poppins/poppins-v15-latin-italic.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    src: local(''),
        url('/fonts/poppins/poppins-v15-latin-500.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Poppins';
    font-style: italic;
    font-weight: 500;
    src: local(''),
        url('/fonts/poppins/poppins-v15-latin-500italic.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    src: local(''),
        url('/fonts/poppins/poppins-v15-latin-600.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Poppins';
    font-style: italic;
    font-weight: 600;
    src: local(''),
        url('/fonts/poppins/poppins-v15-latin-600italic.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 300;
    src: local(''),
        url('/fonts/inter/inter-v3-latin-300.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    src: local(''),
        url('/fonts/inter/inter-v3-latin-regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    src: local(''),
        url('/fonts/inter/inter-v3-latin-600.woff2') format('woff2');
  }


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
    `}
  }

  button {
    cursor: pointer;
  }
`;

export default GlobalStyles;
