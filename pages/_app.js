import React from 'react';
import { makeServer } from '../mock-server/mirage';
import '../styles/antd.css';

makeServer({ environment: 'development' });

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
