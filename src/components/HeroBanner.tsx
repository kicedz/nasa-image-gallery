import Image from 'next/image';
import Link from 'next/link';

interface HeroBannerProps {
    title: string;
    description: string;
    heroImage: {
        fields: {
            file: {
                url: string;
            };
        };
    };
    ctaButton: string;
    ctaLink: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ title, description, heroImage, ctaButton, ctaLink }) => {
    const imageUrl = `https:${heroImage.fields.file.url}`;

    return (
        <div className="relative bg-gradient-to-r from-purple-800 via-indigo-900 to-blue-700 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                {/* Text Section */}
                <div className="z-10 lg:w-1/2">
                    <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                        <span className="block xl:inline text-white">{title}</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                        {description}
                    </p>
                    <div className="mt-5 sm:mt-8">
                        <Link
                            href={ctaLink}
                            className="inline-block px-8 py-3 border-none text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 shadow-lg hover:from-purple-700 hover:via-indigo-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        >
                            {ctaButton}
                        </Link>
                    </div>
                </div>
                {/* Image Section */}
                <div className="mt-10 lg:mt-0 lg:ml-10 lg:w-1/2">
                    <Image
                        className="h-auto w-full object-cover rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
                        src={imageUrl}
                        alt={title}
                        width={1000}
                        height={1000}
                    />
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
