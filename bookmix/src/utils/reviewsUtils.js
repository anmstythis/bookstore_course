import { useState, useEffect } from 'react';
import api from '../axiosSetup';
import { getCurrentUserId } from './userUtils';

export const useReviews = (bookId) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    if (!bookId) return;
    try {
      const { data } = await api.get(`/reviews/book/${bookId}`);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка при загрузке отзывов:', err);
      setError('Не удалось загрузить отзывы');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const submitReview = async (rating, comment) => {
    if (!getCurrentUserId()) {
      setError('Для отправки отзыва необходимо войти');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/reviews', {
        user_id: getCurrentUserId(),
        book_id: bookId,
        rating,
        usercomment: comment
      });
      await fetchReviews();
    } catch {
      setError('Не удалось отправить отзыв');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async (id) => {
    if (!getCurrentUserId()) {
      setError('Необходимо войти, чтобы удалять отзывы');
      return;
    }
    if (!window.confirm('Удалить отзыв?')) return;

    try {
      setDeletingId(id);
      await api.delete(`/reviews/${id}`);
      await fetchReviews();
    } catch {
      setError('Не удалось удалить отзыв');
    } finally {
      setDeletingId(null);
    }
  };

  return {
    reviews,
    error,
    isSubmitting,
    deletingId,
    submitReview,
    deleteReview
  };
};
