import { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    const { footerData, navigationData } = pageProps;

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

export default MyApp;