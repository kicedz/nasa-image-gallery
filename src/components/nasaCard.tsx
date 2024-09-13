import { useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import Image from 'next/image';

interface NASACardProps {
  title: string;
  imageUrl: string;
  tags: string[];
  description: Document;
  datePublished: string;
}

const NASACard: React.FC<NASACardProps> = ({
  title,
  imageUrl,
  tags,
  description,
  datePublished,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="nasa-card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <Image
        src={imageUrl}
        alt={title}
        width={800}
        height={600}
        quality={85}
        className="w-full h-56 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-500 mb-4 italic">
          {new Date(datePublished).toLocaleDateString()}
        </p>
        <div className="tags flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-600 text-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className={`description text-gray-800 leading-relaxed ${isExpanded ? 'max-h-none' : 'max-h-24 overflow-hidden'}`}>
          {documentToReactComponents(description)}
        </div>
        {/* Read More / Read Less Button */}
        <button
          onClick={toggleDescription}
          className="mt-3 text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none w-full"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      </div>
    </div>
  );
};

export default NASACard;
