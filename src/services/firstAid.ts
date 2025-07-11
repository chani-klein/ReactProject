import axios from './axios';

export const getLocalFirstAidGuide = async (prompt: string): Promise<string> => {
  const res = await axios.post('/Ask/local', { Prompt: prompt });
  return res.data.answer || res.data;
};