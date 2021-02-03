import React from 'react';
import { MessageProvider } from '../components/store/messageStore';
import Head from 'next/head';
import { makeServer } from '../mock-server/mirage';
import '../styles/globals.less';

// makeServer({ environment: 'development' });

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Online Education</title>
        <meta key="description" name="description" content="Online Education System" />
      </Head>
      <MessageProvider>
        <Component {...pageProps} />
        );
      </MessageProvider>
    </>
  );
}

export default MyApp;
