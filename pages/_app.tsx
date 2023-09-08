import '../styles/globals.css'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import "node_modules/flag-icons/css/flag-icons.min.css";
import { perCollectionSEOTitle } from '../lib/constants/labels';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="w-screen h-screen overflow-auto">
      <Component {...pageProps} />
      <Head>
        <title>{perCollectionSEOTitle.sandbox}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Analytics />
    </div>
  )
}

