import { GetServerSideProps } from 'next';
import { client, fetchFooterData, fetchNavigationData } from '@/lib/contentfulClient';
import Page from '../components/Page';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Entry } from 'contentful';
import {
    PageEntrySkeleton,
    PageFields,
    NasaGalleryFields,
    NasaCardEntrySkeleton,
} from '../../types';

interface PageProps {
    page: PageFields;
}

export default function Post({ page }: PageProps) {
    const router = useRouter();

    const slug = router.query.slug
        ? Array.isArray(router.query.slug)
            ? router.query.slug.join('')
            : router.query.slug
        : 'Home';
    const capitalizedTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

    if (!page) {
        return <div>Page not found</div>;
    }

    return (
        <>
            <Head>
                <title>{`${capitalizedTitle} - Nasa Image Gallery`}</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Page page={page} />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
    const cfClient = client;
    const slug = params?.slug
        ? Array.isArray(params.slug)
            ? params.slug.join('/')
            : params.slug
        : '/';

    const pageNumber = parseInt(query.page as string) || 1;
    const itemsPerPage = 6;
    const skip = (pageNumber - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const queryParams: Record<string, any> = {
        content_type: 'page',
        'fields.slug': slug,
        include: 10,
        locale: 'en-US',
    };

    const response = await cfClient.getEntries<PageEntrySkeleton>(queryParams);

    if (!response?.items?.length) {
        return {
            notFound: true,
        };
    }

    const page = response.items[0] as Entry<PageEntrySkeleton>;
    const pageFields = page.fields as PageFields;

    const components = pageFields.components || [];

    for (const component of components) {
        if (component.sys.contentType.sys.id === 'nasaGallery') {
            const nasaCardsResponse = await cfClient.getEntries<NasaCardEntrySkeleton>({
                content_type: 'nasaCard',
                order: ['-sys.createdAt'],
                limit,
                skip,
                locale: 'en-US',
            });

            const nasaGalleryFields = component.fields as NasaGalleryFields;
            nasaGalleryFields.nasaCard = nasaCardsResponse.items;
            nasaGalleryFields.totalItems = nasaCardsResponse.total;
        }
    }

    const [footerData, navigationData] = await Promise.all([
        fetchFooterData(),
        fetchNavigationData(),
    ]);

    return {
        props: {
            page: pageFields,
            footerData,
            navigationData,
        },
    };
};
