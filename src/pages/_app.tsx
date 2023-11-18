import { Fragment } from "react";
import Head from "next/head";
import { NextPage } from "next";
import Router from "next/router";
import { AppProps } from "next/app";
import NProgress from "nprogress";
import { ThemeProvider } from "styled-components";
import GoogleAnalytics from "@component/GoogleAnalytics";
import { AppProvider } from "@context/AppContext";
// import { GlobalStyles } from "@utils/globalStyles";
// import { theme } from "@utils/theme";
import "../__server__";
import theme from "../theme";
import GlobalStyles from "theme/globalStyles";
import axiosInstance from "config/axiosInstance";
import { NextIntlClientProvider } from "next-intl";
import { Auth0ProviderWithNavigate } from "@component/AuthProvider";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

NProgress.configure({ showSpinner: false });

// ============================================================
interface MyAppProps extends AppProps {
  Component: NextPage & { layout?: () => JSX.Element };
  messages: any;
}
// ============================================================

const App = ({ Component, pageProps, messages }: MyAppProps) => {
  let Layout = Component.layout || Fragment;
  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta property="og:url" content="https://bonik-react.vercel.app" />
        {/* thumbnail And title for social media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="React Next JS Ecommerce Template" />
        <meta
          property="og:description"
          content="Minimal, clean and Fast Next js ecommerce template. Build Super store, Grocery delivery app, Multivendor store and niche market"
        />
        <meta
          property="og:image"
          content="/assets/images/landing/preview.png"
        />

        {/* Google analytics */}
        <GoogleAnalytics />
      </Head>
      <NextIntlClientProvider messages={messages}>
        <AppProvider>
          <Auth0ProviderWithNavigate>
            <ThemeProvider theme={theme()}>
              <GlobalStyles />

              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </Auth0ProviderWithNavigate>
        </AppProvider>
      </NextIntlClientProvider>
    </Fragment>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
App.getInitialProps = async ({ ctx }) => {
  try {
    // ToDO: get translations from cache or cookies
    const response = await axiosInstance.get(
      `/api/translations?locale=${ctx.locale}`
    );
    return {
      messages: response.data.messages,
    };
  } catch (err) {
    return {
      messages: {},
    };
  }
};

export default App;
