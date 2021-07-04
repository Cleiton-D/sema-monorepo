import { ThemeProvider } from 'styled-components';

import theme from 'styles/theme';
import GlobalStyles from 'styles/global';

export const parameters = {
  backgrounds: {
    default: 'sema-light',
    values: [
      {
        name: 'sema-light',
        value: theme.colors.mainBg
      },
      {
        name: 'sema-white',
        value: theme.colors.white
      }
    ]
  }
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Story />
    </ThemeProvider>
  )
];
