// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { Analytics } from '@vercel/analytics/react';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>          
        </Head>
        <body>
          <Main />
          <NextScript />
          <Analytics />
        </body>
      </Html>
    )
  }
}

export default MyDocument