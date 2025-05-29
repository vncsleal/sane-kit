// frontend/src/lib/getDictionary.ts
import type { Locale } from './i18n-config';

// Import the full dictionary types
import { dictionary as enDictionary } from './dictionaries.en';

// Define a more general Dictionary type based on the structure of your dictionary files
export type Dictionary = typeof enDictionary; // Assuming 'en' has the base structure

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  'en': () => import('./dictionaries.en').then((module) => module.dictionary),
  'pt-BR': () => import('./dictionaries.pt-BR').then((module) => module.dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const load = dictionaries[locale] || dictionaries['en']; 
  return load();
};
