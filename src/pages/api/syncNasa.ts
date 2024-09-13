import { NextApiRequest, NextApiResponse } from 'next';
import { syncNasaImagesToContentful } from '../../../lib/nasaFetcher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await syncNasaImagesToContentful();
  res.status(200).json({ message: 'NASA images synced with Contentful' });
}
