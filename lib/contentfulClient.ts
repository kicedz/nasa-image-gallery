import { createClient, EntryCollection } from 'contentful';
import { FooterEntrySkeleton, NavigationEntrySkeleton } from '../types';

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_TOKEN ?? '',
});

export const previewClient = createClient({
  host: 'preview.contentful.com',
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN ?? '',
});

export const fetchNasaCards = async (): Promise<EntryCollection<any>> => {
  try {
    const nasaCards = await client.getEntries({
      content_type: 'nasaCard',
      limit: 100,
    });

    return nasaCards;
  } catch (error) {
    console.error('Error fetching nasaCards from Contentful:', error);
    throw error;
  }
};

export async function fetchFooterData(): Promise<FooterEntrySkeleton['fields'] | null> {
  try {
    const response = await client.getEntries<FooterEntrySkeleton>({
      content_type: 'footer',
      limit: 1,
    });

    if (response.items.length > 0) {
      return response.items[0].fields;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching footer data from Contentful:', error);
    return null;
  }
}

export async function fetchNavigationData(): Promise<NavigationEntrySkeleton['fields'] | null> {
  try {
    const response = await client.getEntries<NavigationEntrySkeleton>({
      content_type: 'navigation',
      limit: 1,
    });

    if (response.items.length > 0) {
      return response.items[0].fields;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching navigation data from Contentful:', error);
    return null;
  }
}
