import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCurrentUserId } from './userUtils.js';
import { getCartFromStorage } from './cartUtils.js';
import { getFavoritesFromStorage } from './favoriteUtils.js';

export const useBooksData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, authorsRes, publishersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/books'),
          axios.get('http://localhost:5000/api/authors'),
          axios.get('http://localhost:5000/api/publishers')
        ]);

        const authors = authorsRes.data || [];
        const publishers = publishersRes.data || [];

        const userId = getCurrentUserId();
        const cart = getCartFromStorage(userId);
        const favorites = getFavoritesFromStorage(userId);

        const cartByBookId = new Map(cart.map(ci => [ci.bookId, ci.quantity]));
        const favoriteIds = new Set(favorites.map(f => f.bookId));

        const mapped = (booksRes.data || []).map(row => {
          const author = authors.find(a => a.id_author === row.author_id);
          const publisher = publishers.find(p => p.id_publisher === row.publisher_id);

          return {
            id: row.id_book,
            name: row.title,
            authorId: row.author_id,
            author: author ? `${author.firstname} ${author.lastname}` : 'Неизвестный автор',
            price: Number(row.price),
            url: row.imageurl,
            publisher: publisher.legalname,
            description: row.description,
            categoryId: row.category_id,
            addedToCart: cartByBookId.has(row.id_book),
            addedAmount: cartByBookId.get(row.id_book) || 0,
            isFavorite: favoriteIds.has(row.id_book),
          };
        });

        setData(mapped);
        console.log('Полученные книги:', mapped);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, setData, error, loading };
};
