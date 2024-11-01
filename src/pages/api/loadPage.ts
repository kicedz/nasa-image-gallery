// src/pages/api/loadPage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '@/lib/contentfulClient';
import { NasaCardEntrySkeleton } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, itemsPerPage = 6 } = req.query;
  const skip = (Number(page) - 1) * Number(itemsPerPage);

  try {
    const response = await client.getEntries<NasaCardEntrySkeleton>({
      content_type: 'nasaCard',
      skip,
      limit: Number(itemsPerPage),
      order: ['-sys.createdAt'], // Ensure newest items come first
    });

    res.status(200).json({
      items: response.items,
      total: response.total,
    });
  } catch (error) {
    console.error('Error loading NASA cards:', error);
    res.status(500).json({ error: 'Error loading NASA cards' });
  }
}
