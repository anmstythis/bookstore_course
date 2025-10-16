import React, { useState } from 'react';
import Form from './Form.js';

const ReviewForm = ({ onSubmit, loading, error }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setComment('');
    setRating(5);
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Отправить отзыв" loadingLabel="Отправка...">
      <div className='formLabel' role='radiogroup' aria-label='Оценка'>
        {[1,2,3,4,5].map((value) => (
          <button
            key={value}
            type='button'
            className={value <= rating ? 'favButton' : 'notFavButton'}
            onClick={() => !loading && setRating(value)}
            disabled={loading}
          >
            {value <= rating ? '★' : '☆'}
          </button>
        ))}
      </div>
      <textarea
        className='formInput'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Поделитесь впечатлением о книге'
        rows={4}
        disabled={loading}
      />
    </Form>
  );
};

export default ReviewForm;
