import { promises as fs } from 'fs';
import path from 'path';

const storageFilePath = path.join(process.cwd(), 'data', 'nasaData.json');

const ensureStorageDirExists = async () => {
  const storageDir = path.dirname(storageFilePath);
  try {
    await fs.mkdir(storageDir, { recursive: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating storage directory:', error.message);
    } else {
      console.error('Unknown error occurred while creating storage directory:', error);
    }
  }
};

export const readStoredNasaData = async (): Promise<any[]> => {
  try {
    await ensureStorageDirExists();
    const data = await fs.readFile(storageFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error && (error as any).code === 'ENOENT') {
      return [];
    } else if (error instanceof Error) {
      console.error('Error reading storage file:', error.message);
      return [];
    } else {
      console.error('Unknown error occurred while reading storage file:', error);
      return [];
    }
  }
};

export const storeNasaData = async (nasaData: any[]) => {
  try {
    await ensureStorageDirExists();
    await fs.writeFile(storageFilePath, JSON.stringify(nasaData, null, 2));
    console.log('NASA data stored locally');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error storing NASA data:', error.message);
    } else {
      console.error('Unknown error occurred while storing NASA data:', error);
    }
  }
};
