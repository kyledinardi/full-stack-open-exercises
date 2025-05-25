import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllEntries = async () => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

export const createEntry = async (entry: NewDiaryEntry) => {
  try {
    const response = await axios.post<DiaryEntry>(baseUrl, entry);
    return response.data;
  } catch (error) {
    let errorMessage = 'Something went wrong.';

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
