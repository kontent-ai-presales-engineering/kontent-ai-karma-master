import '../styles/globals.scss';
import { AppProps } from 'next/app';
import 'node_modules/flag-icons/css/flag-icons.min.css';
import { perCollectionSEOTitle } from '../lib/constants/labels';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='h-screen'>
      <Component {...pageProps} />
    </div>
  );
}
