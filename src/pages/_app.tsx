import App, { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/globals.css';
import { FooterFields, NavigationFields } from '../../types';

interface MyAppProps extends AppProps {
    footerData: FooterFields;
    navigationData: NavigationFields;
}

function MyApp({ Component, pageProps, footerData, navigationData }: MyAppProps): JSX.Element {
    return (
        <>
            <Head>
                <title>Contentful - Next.js</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar navigationData={navigationData} />
            <Component {...pageProps} />
            <Footer footerData={footerData} />
        </>
    );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext);

    const { fetchFooterData, fetchNavigationData } = await import('@/lib/contentfulClient');
    const [footerData, navigationData] = await Promise.all([fetchFooterData(), fetchNavigationData()]);

    return { ...appProps, footerData, navigationData };
};

export default MyApp;