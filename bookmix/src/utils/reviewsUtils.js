import { useState, useEffect } from 'react';
import axios from 'axios';

export const useReviews = (bookId) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    if (!bookId) return;
    try {
      const { data } = await axios.get(`http://localhost:5000/api/reviews/book/${bookId}`);
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
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.id_user) {
      setError('Для отправки отзыва необходимо войти');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post('http://localhost:5000/api/reviews', {
        user_id: storedUser.id_user,
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
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.id_user) {
      setError('Необходимо войти, чтобы удалять отзывы');
      return;
    }
    if (!window.confirm('Удалить отзыв?')) return;

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
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
