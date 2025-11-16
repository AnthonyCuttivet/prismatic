import axios from 'axios';
import { Card } from '../types/card';

// Fetch cards from local JSON file in public folder
export const fetchAllCards = async (): Promise<Card[]> => {
  try {
    // Fetch from public folder
    const response = await axios.get<Card[]>('/data/cards.json');
    return response.data;
  } catch (error) {
    console.error('Error loading cards:', error);
    throw new Error('Failed to load card data');
  }
};

// Helper functions to filter/search cards
export const getCardsBySet = (cards: Card[], setCode: string): Card[] => {
  return cards.filter(card => card.set === setCode);
};

export const getCardsByRarity = (cards: Card[], rarity: string): Card[] => {
  return cards.filter(card => card.rarity === rarity);
};

export const getCardsByDomain = (cards: Card[], domain: string): Card[] => {
  return cards.filter(card => card.domain.includes(domain));
};

export const searchCards = (cards: Card[], query: string): Card[] => {
  const lowerQuery = query.toLowerCase();
  return cards.filter(card =>
    card.name.toLowerCase().includes(lowerQuery) ||
    card.description.toLowerCase().includes(lowerQuery) ||
    card.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
