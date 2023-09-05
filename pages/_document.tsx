// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import React from 'react'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>          
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script src="https://app.kontent.ai/js-api/custom-element/v1/custom-element.min.js" strategy="beforeInteractive"></Script>
        </body>
      </Html>
    )
  }
}

export default MyDocument
