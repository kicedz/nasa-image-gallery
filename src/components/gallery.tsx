import { useRouter } from 'next/router';
import NASACard from './nasaCard';
import { NasaCardEntrySkeleton } from '../../types';
import { Entry } from 'contentful';
import { useState } from 'react';

interface GalleryProps {
    title: string;
    nasaCard: Entry<NasaCardEntrySkeleton>[];
    totalItems: number;
    itemsPerPage: number;
}

const Gallery: React.FC<GalleryProps> = ({
    title,
    nasaCard,
    totalItems,
    itemsPerPage,
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const currentPage = parseInt(router.query.page as string) || 1;


    const totalPages = Math.ceil(totalItems / itemsPerPage);


    const goToPage = (pageNumber: number) => {
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, page: pageNumber },
            },
            undefined,
            { shallow: false }
        );
    };


    const syncNasaImages = async () => {
        setLoading(true);
        try {

            await fetch('/api/syncNasa');


            setTimeout(() => {

                goToPage(1);
                setLoading(false);
            }, 0);
        } catch (error) {
            console.error('Error fetching new images:', error);
            setLoading(false);
        }
    };

    if (!nasaCard || !nasaCard.length) {
        console.error('nasaCard is undefined or empty');
        return <p>No gallery content available</p>;
    }

    return (
        <section className="gallery mx-auto container px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold my-10 text-center text-black">
                {title}
            </h1>

            {/* Sync NASA Images Button */}
            <div className="flex justify-center my-6">
                <button
                    onClick={syncNasaImages}
                    className={`inline-block px-8 py-3 border-none text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 shadow-lg hover:from-purple-700 hover:via-indigo-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 ${loading ? 'animate-pulse' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Want More Images?'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {nasaCard.map((card) => {
                    const fields = card.fields as {
                        title: string;
                        imageUrl: string;
                        tags: string[];
                        description: any;
                        datePublished: string;
                    };

                    return (
                        <NASACard
                            key={card.sys.id}
                            title={fields.title}
                            imageUrl={fields.imageUrl}
                            tags={fields.tags}
                            description={fields.description}
                            datePublished={fields.datePublished}
                        />
                    );
                })}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-10 space-x-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => goToPage(number)}
                        className={`px-4 py-2 rounded-lg ${currentPage === number
                            ? 'bg-indigo-700 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </section>
    );
};

export default Gallery;
