import { createClient } from 'contentful-management';
import { fetchTagsFromOpenAI } from './openaiSender';

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN ?? '',
});

const convertToRichText = (text: string) => {
  return {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        content: [
          {
            nodeType: 'text',
            value: text,
            marks: [],
            data: {},
          },
        ],
        data: {},
      },
    ],
  };
};

const fetchGalleryPage = async (environment: any) => {
  const response = await environment.getEntries({
    content_type: 'page',
    'fields.slug': 'gallery',
  });

  if (response.items.length === 0) {
    throw new Error('Gallery page not found');
  }

  return response.items[0];
};

const findAndUpdateNasaGallery = async (environment: any, newNasaCard: any) => {
  const galleryPage = await fetchGalleryPage(environment);

  const components = galleryPage.fields.components?.['en-US'];
  if (!components || !Array.isArray(components)) {
    throw new Error('Components field is missing or not properly localized in the gallery page.');
  }

  const nasaGalleryComponentId = components[0].sys.id;
  const nasaGalleryComponent = await environment.getEntry(nasaGalleryComponentId);

  if (nasaGalleryComponent.sys.contentType.sys.id !== 'nasaGallery') {
    throw new Error('nasaGallery component not found in the gallery page.');
  }
  const existingNasaCards = nasaGalleryComponent.fields.nasaCard?.['en-US'] || [];
  const updatedNasaCards = [{ sys: { id: newNasaCard.sys.id, linkType: 'Entry', type: 'Link' } }, ...existingNasaCards];
  nasaGalleryComponent.fields.nasaCard['en-US'] = updatedNasaCards;

  const updatedNasaGallery = await nasaGalleryComponent.update();
  await updatedNasaGallery.publish();

  console.log('nasaGallery component updated and published with new NasaCard at the top.');

  return nasaGalleryComponent;
};

export const createNasaCardInContentful = async (nasaData: any) => {
  try {
    const tags = await fetchTagsFromOpenAI(nasaData.explanation, nasaData.url);

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID ?? '');
    const environment = await space.getEnvironment('master');

    const newNasaCard = await environment.createEntry('nasaCard', {
      fields: {
        title: {
          'en-US': nasaData.title || 'No Title',
        },
        imageUrl: {
          'en-US': nasaData.url || '',
        },
        tags: {
          'en-US': tags,
        },
        description: {
          'en-US': convertToRichText(nasaData.explanation || 'No description available.'),
        },
        datePublished: {
          'en-US': nasaData.date || new Date().toISOString(),
        },
      },
    });

    await newNasaCard.publish();
    console.log(`NasaCard '${nasaData.title}' created and published.`);

    const updatedNasaGallery = await findAndUpdateNasaGallery(environment, newNasaCard);
    console.log('nasaGallery updated and published.');

    return newNasaCard;
  } catch (error) {
    console.error('Error creating or updating nasaCard in Contentful:', error);
  }
};
