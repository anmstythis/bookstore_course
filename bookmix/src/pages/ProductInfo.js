import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import { motion } from "framer-motion";
import Form from '../components/Form.js';

const ProductInfo = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isDeletingReviewId, setIsDeletingReviewId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const getCurrentUserId = () => {
    try {
      const userRaw = localStorage.getItem('user');
      if (!userRaw) return null;
      const parsed = JSON.parse(userRaw);
      return parsed?.id_user || null;
    } catch {
      return null;
    }
  };

  const getCartFromStorage = (userId) => {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`cart:${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveCartToStorage = (userId, cartItems) => {
    if (!userId) return;
    localStorage.setItem(`cart:${userId}`, JSON.stringify(cartItems));
  };

  useEffect(() => {
  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      if (!response.data) throw new Error("Такой книги нет!");
      const row = response.data;

      const authorResponse = await axios.get(`http://localhost:5000/api/authors/${row.author_id}`);
      const author = authorResponse.data;

      const userId = getCurrentUserId();
      const cart = getCartFromStorage(userId);
      const inCart = cart.find(ci => ci.bookId === row.id_book);

      const mapped = {
        id: row.id_book,
        name: row.title,
        authorId: row.author_id,
        author: author ? `${author.firstname} ${author.patronymic ? author.patronymic : ' '} ${author.lastname} 
        (${author.birthdate ? author.birthdate.substring(0, 4) : '???'} - 
            ${author.deathdate ? author.deathdate.substring(0, 4) : 'н.в.'})` : 'Неизвестный автор',
        country: row.country,
        price: Number(row.price),
        url: row.imageurl,
        description: row.description,
        addedToCart: Boolean(inCart),
        addedAmount: inCart ? inCart.quantity : 0,
        isFavorite: row.isfavorite || false
      };

      setBook(mapped);
    } catch (err) {
      console.error("Ошибка при загрузке:", err);
      setError(err.message);
    }
  };

  fetchBook();
}, [id]);


  useEffect(() => {
  const fetchReviews = async () => {
    try {
      if (!id) return;
      const { data } = await axios.get(`http://localhost:5000/api/reviews/book/${id}`);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка при загрузке отзывов:', err);
      setReviewsError('Не удалось загрузить отзывы');
    }
  };

  fetchReviews();
}, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!book) return;
    const storedUserString = localStorage.getItem('user');
    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    if (!storedUser?.id_user) {
      setReviewsError('Для отправки отзыва необходимо войти в систему');
      return;
    }

    try {
      setIsSubmittingReview(true);
      setReviewsError(null);
      await axios.post('http://localhost:5000/api/reviews', {
        user_id: storedUser.id_user,
        book_id: book.id,
        rating: Number(rating),
        usercomment: comment
      });

      const { data } = await axios.get(`http://localhost:5000/api/reviews/book/${book.id}`);
      setReviews(Array.isArray(data) ? data : []);
      setRating(5);
      setComment('');
    } catch (err) {
      console.error('Ошибка при отправке отзыва:', err);
      setReviewsError('Не удалось отправить отзыв');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const storedUserString = localStorage.getItem('user');
    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    if (!storedUser?.id_user) {
      setReviewsError('Необходимо войти, чтобы удалять отзывы');
      return;
    }

    if (!window.confirm('Удалить этот отзыв?')) {
      return;
    }

    try {
      setIsDeletingReviewId(reviewId);
      setReviewsError(null);
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
      const { data } = await axios.get(`http://localhost:5000/api/reviews/book/${id}`);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка при удалении отзыва:', err);
      setReviewsError('Не удалось удалить отзыв');
    } finally {
      setIsDeletingReviewId(null);
    }
  };


  // корзина
  const addToCart = () => {
    if (!book) return;
    const userId = getCurrentUserId();
    const cart = getCartFromStorage(userId);
    const exists = cart.find(ci => ci.bookId === book.id);
    const newCart = exists
      ? cart.map(ci => ci.bookId === book.id ? { ...ci, quantity: ci.quantity + 1 } : ci)
      : [...cart, { bookId: book.id, quantity: 1 }];
    saveCartToStorage(userId, newCart);

    const updated = {
      ...book,
      addedToCart: true,
      addedAmount: (book.addedAmount || 0) + 1
    };
    setBook(updated);
  };

  const removeFromCart = () => {
    if (!book) return;
    const userId = getCurrentUserId();
    const cart = getCartFromStorage(userId);
    const exists = cart.find(ci => ci.bookId === book.id);
    let newCart;
    if (!exists) {
      newCart = cart;
    } else if (exists.quantity <= 1) {
      newCart = cart.filter(ci => ci.bookId !== book.id);
    } else {
      newCart = cart.map(ci => ci.bookId === book.id ? { ...ci, quantity: ci.quantity - 1 } : ci);
    }
    saveCartToStorage(userId, newCart);

    const updatedAmount = Math.max((book.addedAmount || 0) - 1, 0);
    const updated = {
      ...book,
      addedAmount: updatedAmount,
      addedToCart: updatedAmount > 0
    };
    setBook(updated);
  };

  // избранное
  const toggleFavorite = () => {
    if (!book) return;
    const updated = { ...book, isFavorite: !book.isFavorite };
    setBook(updated);
    axios.put(`http://localhost:5000/api/books/${book.id}`, updated).catch(console.error);
  };

  if (error) return <div className='welcome'>Ошибка: {error}</div>;
  if (!book) return <div className='welcome'>Загрузка...</div>;

  return (
    <div>
      <Header title="Сведения о книге" />

      <motion.div
        className='productInfoCard'
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <img className='prodImg' src={book.url} alt={book.name} />

        <button
          className={book.isFavorite ? 'favButton2' : 'notFavButton2'}
          onClick={toggleFavorite}
        >
          ❤
        </button>

        <h2 className='titleProd'>Название: {book.name}</h2>
        <h2 className='authorProd'>Автор: {book.author}</h2>
        {book.country && <h2 className='countryProd'>Страна: {book.country}</h2>}

        <div className='buttons2'>
          <button className='cartButton' onClick={addToCart}>+</button>
          <span className='amount'>{book.addedAmount}</span>
          <button className='cartButton' onClick={removeFromCart}>-</button>
        </div>

        <p className='descrProd'>{book.description}</p>
      </motion.div>

      <div className='reviewsSection'>
        <h3 className='welcome'>Отзывы</h3>
          {reviews.length === 0 ? (
          <p className='head'>Пока нет отзывов.</p>
        ) : (
          <ul className='reviewsList'>
            {reviews.map((rev) => {
              const storedUserString = localStorage.getItem('user');
              const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
              const isMyReview = storedUser?.id_user && rev.user_id === storedUser.id_user;
              return (
                <li key={rev.id_review} className='reviewItem'>
                  <div className='reviewHeader'>
                    <strong>{rev.firstname} {rev.lastname}</strong>
                    <span>Оценка: {rev.rating}</span>
                    <span>{new Date(rev.reviewdate).toLocaleDateString()}</span>
                    {isMyReview && (
                      <button
                        type='button'
                        className='reviewDeleteBtn'
                        onClick={() => handleDeleteReview(rev.id_review)}
                        disabled={isDeletingReviewId === rev.id_review}
                        aria-label='Удалить отзыв'
                        title='Удалить отзыв'
                      >
                        {isDeletingReviewId === rev.id_review ? '…' : '✕'}
                      </button>
                    )}
                  </div>
                  <div className='reviewComment'>{rev.usercomment}</div>
                </li>
              );
            })}
          </ul>
        )}
        <div className='formContainer'>
          <Form
            onSubmit={handleSubmitReview}
            loading={isSubmittingReview}
            error={reviewsError || ''}
            submitLabel="Отправить отзыв"
            loadingLabel="Отправка..."
          >
            <div className='formLabel' role='radiogroup' aria-label='Оценка'>
              {[1,2,3,4,5].map((value) => (
                <button
                  key={value}
                  type='button'
                  className={value <= Number(rating) ? 'favButton' : 'notFavButton'}
                  aria-checked={value === Number(rating)}
                  role='radio'
                  onClick={() => !isSubmittingReview && setRating(value)}
                  disabled={isSubmittingReview}
                >
                  {value <= Number(rating) ? '★' : '☆'}
                </button>
              ))}
            </div>
            <textarea className='formInput'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Поделитесь впечатлением о книге'
              rows={4}
              disabled={isSubmittingReview}
            />
          </Form>
        </div>
      </div>

      <motion.div
        initial={{ y: 1000 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default ProductInfo;
