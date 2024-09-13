import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const openaiDataPath = path.join(process.cwd(), 'data', 'openaiData.json');
const openaiApiKey = process.env.OPENAI_API_KEY;

interface OpenAiError extends Error {
  code?: string;
}

const ensureOpenaiDataDirExists = async () => {
  const storageDir = path.dirname(openaiDataPath);
  await fs.mkdir(storageDir, { recursive: true });
};

const readOpenaiData = async (): Promise<any[]> => {
  try {
    await ensureOpenaiDataDirExists();
    const data = await fs.readFile(openaiDataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as OpenAiError).code === 'ENOENT') {
      return [];
    } else {
      console.error('Error reading openaiData.json:', error);
      return [];
    }
  }
};

const storeOpenaiData = async (data: any[]) => {
  try {
    await fs.writeFile(openaiDataPath, JSON.stringify(data, null, 2));
    console.log('OpenAI data stored locally');
  } catch (error) {
    console.error('Error storing OpenAI data:', error);
  }
};

export const fetchTagsFromOpenAI = async (imageDescription: string, imageUrl: string | null = null) => {
  try {
    const prompt = `Generate exactly 10 relevant tags for the following image description:\n\nDescription: "${imageDescription}"\n${
      imageUrl ? `Image URL: ${imageUrl}` : ''
    }\n\nRespond only with a comma-separated list of 10 tags.`;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an assistant that generates concise tags for image descriptions.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const tags = response.data.choices[0]?.message?.content.split(',').map((tag: string) => tag.trim()) || ['NASA'];
    const usage = response.data.usage;
    const cost = calculateOpenAiCost(usage);

    const openaiData = await readOpenaiData();
    openaiData.push({
      imageDescription,
      imageUrl,
      tags,
      cost,
      timestamp: new Date().toISOString(),
    });

    await storeOpenaiData(openaiData);
    return tags;
  } catch (error) {
    console.error('Error fetching tags from OpenAI:', error);
    return ['NASA'];
  }
};

const calculateOpenAiCost = (usage: any) => {
  const promptTokens = usage.prompt_tokens || 0;
  const completionTokens = usage.completion_tokens || 0;
  const totalTokens = promptTokens + completionTokens;

  const costPerToken = 0.075 / 1_000_000;
  const cost = totalTokens * costPerToken;

  return cost.toFixed(10);
};
