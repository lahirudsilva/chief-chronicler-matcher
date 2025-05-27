import { AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import Layout from '../components/Layout/Layout';
import '../styles/globals.scss';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default trpc.withTRPC(MyApp);