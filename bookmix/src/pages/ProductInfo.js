import { useParams } from 'react-router-dom';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import ReviewList from '../components/ReviewList.js';
import ReviewForm from '../components/ReviewForm.js';
import { motion } from "framer-motion";
import { addToCartStorage, removeFromCartStorage } from '../utils/cartUtils.js';
import { toggleFavoriteStorage } from '../utils/favoriteUtils.js';
import { useBooksData } from '../utils/booksUtils.js';
import { useReviews,  } from '../utils/reviewsUtils.js';

const ProductInfo = () => {
  const { id } = useParams(); 
  const { data, setData, error } = useBooksData();
  const { reviews, error: reviewsError, isSubmitting, deletingId, submitReview, deleteReview } = useReviews(id);

  const book = data.find(item => item.id === Number(id));

  const addToCart = (id) => {
    addToCartStorage(id);
    setData(prev => prev.map(item =>
      item.id === id
        ? { ...item, addedToCart: true, addedAmount: item.addedAmount + 1 }
        : item
    ));
  };

  const removeFromCart = (id) => {
    removeFromCartStorage(id);
    setData(prev => prev.map(item =>
      item.id === id
        ? { ...item, addedAmount: Math.max(item.addedAmount - 1, 0), addedToCart: item.addedAmount - 1 > 0 }
        : item
    ));
  };

  const becomeFavorite = (id) => {
    const result = toggleFavoriteStorage(id);
    if (!result) {
      alert('Войдите в систему, чтобы добавить книгу в избранное');
      return;
    }

    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: result.isFavorite } : item
      )
    );
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
          onClick={() => becomeFavorite(book.id)}
        >
          ❤
        </button>

        <h2 className='titleProd'>Название: {book.name}</h2>
        <h2 className='authorProd'>Автор: {book.author}</h2>
        {book.publisher && <h2 className='countryProd'>Издатель: {book.publisher}</h2>}

        <div className='buttons2'>
          <button className='cartButton' onClick={() => addToCart(book.id)}>+</button>
          <span className='amount'>{book.addedAmount}</span>
          <button className='cartButton' onClick={() => removeFromCart(book.id)}>-</button>
        </div>

        <p className='descrProd'>{book.description}</p>
      </motion.div>

      <div className='reviewsSection'>
        <h3 className='welcome'>Отзывы</h3>
          {reviews.length === 0 ? (
          <p className='head'>Пока нет отзывов.</p>
        ) : (
          <ReviewList reviews={reviews} deletingId={deletingId} onDelete={deleteReview}/>
        )}
        <div className='formContainer'>
          <ReviewForm onSubmit={submitReview} loading={isSubmitting} error={reviewsError} />
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
