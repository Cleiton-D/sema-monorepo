import 'styles/global.css';

import { AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';


import { QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ThemeProvider } from 'styled-components';

import { AtomProvider, AtomHydrator } from 'hooks/AtomProvider';
import { AccessProvider } from 'hooks/AccessProvider';

import GlobalStyles from 'styles/global';
import theme from 'styles/theme';

import { queryClient } from 'services/api';

import { WithAccessOptions } from 'utils/validateHasAccess';
import { SessionProvider } from 'context/Session';
import { Toaster } from 'sonner';

type AppProps = NextAppProps & {
  Component: NextAppProps['Component'] & {
    auth?: WithAccessOptions;
  };
};
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={pageProps.session}>
          <AtomProvider initialState={pageProps.initialState}>
            <AtomHydrator initialState={pageProps.initialState}>
              <ThemeProvider theme={theme}>
                <Head>
                  <title>Diário Online</title>
                </Head>

                <GlobalStyles />
                <Toaster richColors position="top-right" />

                <NextNprogress
                  color={theme.colors.primary}
                  startPosition={0.3}
                  stopDelayMs={200}
                  height={5}
                />

                {Component.auth ? (
                  <AccessProvider access={Component.auth}>
                    <Component {...pageProps} />
                  </AccessProvider>
                ) : (
                  <Component {...pageProps} />
                )}

              </ThemeProvider>
            </AtomHydrator>
          </AtomProvider>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  );

  // return (

  //   //             <ToastContainer />
  // );
};

export default App;
