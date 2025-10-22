import { getCurrentUserId } from './userUtils.js';

export const getCartFromStorage = (userId = getCurrentUserId()) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`cart:${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCartToStorage = (cartItems, userId = getCurrentUserId()) => {
  if (!userId) return;
  localStorage.setItem(`cart:${userId}`, JSON.stringify(cartItems));
};

export const addToCartStorage = (bookId, quantity = 1) => {
  const userId = getCurrentUserId();
  if (!userId) return null;
  const cart = getCartFromStorage(userId);
  const exists = cart.find(ci => ci.bookId === bookId);
  const newCart = exists
    ? cart.map(ci =>
        ci.bookId === bookId ? { ...ci, quantity: ci.quantity + quantity } : ci
      )
    : [...cart, { bookId, quantity }];
  saveCartToStorage(newCart, userId);
  return newCart;
};

export const removeFromCartStorage = (bookId) => {
  const userId = getCurrentUserId();
  if (!userId) return null;
  const cart = getCartFromStorage(userId);
  const exists = cart.find(ci => ci.bookId === bookId);
  if (!exists) return cart;
  const newCart =
    exists.quantity <= 1
      ? cart.filter(ci => ci.bookId !== bookId)
      : cart.map(ci =>
          ci.bookId === bookId
            ? { ...ci, quantity: ci.quantity - 1 }
            : ci
        );
  saveCartToStorage(newCart, userId);
  return newCart;
};
