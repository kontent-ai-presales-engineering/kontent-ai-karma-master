import '../styles/globals.scss';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { LivePreviewProvider } from '../components/shared/contexts/LivePreview';
import {
  SmartLinkProvider,
  useSmartLink,
} from '../components/shared/contexts/SmartLink';
import { UserProvider } from '../contexts/user.context';

const App = ({
  Component,
  pageProps,
}: AppProps) => {
  const smartLink = useSmartLink();

  return (
    <LivePreviewProvider smartLink={smartLink}>
      <div className="w-full h-screen">
        <Component {...pageProps} />
        <Head>
          <link
            rel="icon"
            href="/favicon.png"
          />
        </Head>
      </div>
    </LivePreviewProvider>
  );
};

export default function MyApp(props: AppProps) {
  return (
    <SmartLinkProvider>
      <UserProvider>
        <App {...props} />
      </UserProvider>
    </SmartLinkProvider>
  );
}