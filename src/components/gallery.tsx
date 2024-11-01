// src/components/gallery.tsx
import { useEffect, useRef, useCallback } from 'react';
import NASACard from './nasaCard';
import { useGallery } from '@/hooks/useGallery';
import { Entry } from 'contentful';
import { NasaCardEntrySkeleton } from '../../types';

interface GalleryProps {
    title: string;
    itemsPerPage: number;
}

const Gallery: React.FC<GalleryProps> = ({ title, itemsPerPage }) => {
    const { items, loadMoreItems, syncNasaImages, loading, hasMore } = useGallery({ itemsPerPage });

    // Reference for the sentinel (bottom of the list)
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // Infinite scroll with IntersectionObserver
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !loading) {
                loadMoreItems();
            }
        },
        [loadMoreItems, hasMore, loading]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
        if (sentinelRef.current) observer.observe(sentinelRef.current);

        return () => {
            if (sentinelRef.current) observer.unobserve(sentinelRef.current);
        };
    }, [handleObserver]);

    return (
        <section className="gallery mx-auto container px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold my-10 text-center text-black">{title}</h1>

            {/* Sync NASA Images Button */}
            <div className="flex justify-center my-6">
                <button
                    onClick={syncNasaImages}
                    className={`inline-block px-8 py-3 border-none text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 shadow-lg hover:from-purple-700 hover:via-indigo-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 ${loading ? 'animate-pulse' : ''
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Want More Images?'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((card) => {
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

            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={sentinelRef} className="mt-10 h-10"></div>}
        </section>
    );
};

export default Gallery;
