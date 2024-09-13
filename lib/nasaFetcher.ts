import { fetchNasaImages } from './nasaApi';
import { createNasaCardInContentful } from './contentfulSender';
import { fetchNasaCards } from './contentfulClient';
import { readStoredNasaData, storeNasaData } from './storage';

const imageExistsInLocalStorage = async (imageUrl: string): Promise<boolean> => {
  const storedNasaData = await readStoredNasaData();
  return storedNasaData.some((entry: any) => entry.url === imageUrl);
};

const imageExistsInContentful = async (imageUrl: string): Promise<boolean> => {
  const nasaCards = await fetchNasaCards();
  return nasaCards.items.some((card: any) => card.fields.imageUrl['en-US'] === imageUrl);
};

export const syncNasaImagesToContentful = async () => {
  const storedNasaData = await readStoredNasaData();

  if (storedNasaData.length >= 100) {
    console.log('Maximum limit of 100 images reached. No more images will be stored.');
    return;
  }

  const nasaImages = await fetchNasaImages(2);

  const newImages = await Promise.all(
    nasaImages.filter(async (image: any) => {
      const existsLocally = await imageExistsInLocalStorage(image.url);
      const existsInContentful = await imageExistsInContentful(image.url);
      return !existsLocally && !existsInContentful;
    }),
  );

  const updatedStoredData = [...storedNasaData, ...newImages].slice(0, 100);

  await storeNasaData(updatedStoredData);

  for (const image of newImages) {
    await createNasaCardInContentful(image);
  }
};
