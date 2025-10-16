import { getCurrentUserId } from './userUtils.js';

export const getFavoritesFromStorage = (userId = getCurrentUserId()) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`favorites:${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveFavoritesToStorage = (favorites, userId = getCurrentUserId()) => {
  if (!userId) return;
  localStorage.setItem(`favorites:${userId}`, JSON.stringify(favorites));
};

export const toggleFavoriteStorage = (bookId) => {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const favorites = getFavoritesFromStorage(userId);
  const isAlreadyFavorite = favorites.some(f => f.bookId === bookId);

  let updatedFavorites;
  if (isAlreadyFavorite) {
    updatedFavorites = favorites.filter(f => f.bookId !== bookId);
  } else {
    updatedFavorites = [...favorites, { bookId }];
  }

  saveFavoritesToStorage(updatedFavorites, userId);

  return { bookId, isFavorite: !isAlreadyFavorite };
};
