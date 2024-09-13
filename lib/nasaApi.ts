import axios from 'axios';

const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

export const fetchNasaImages = async (count: number) => {
  const apiKey = process.env.NASA_API_KEY;
  const url = `${NASA_API_URL}?api_key=${apiKey}&count=${count}`;
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error('Error fetching data from NASA API', error);
    return [];
  }
};
