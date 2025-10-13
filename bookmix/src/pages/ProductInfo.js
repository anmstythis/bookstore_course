import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import { motion } from "framer-motion";

const ProductInfo = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      if (!response.data) throw new Error("Такой книги нет!");
      const row = response.data;

      const authorResponse = await axios.get(`http://localhost:5000/api/authors/${row.author_id}`);
      const author = authorResponse.data;

      const mapped = {
        id: row.id_book,
        name: row.title,
        authorId: row.author_id,
        author: author ? `${author.firstname} ${author.patronymic} ${author.lastname} 
        (${author.birthdate ? author.birthdate.substring(0, 4) : '???'} - 
            ${author.deathdate ? author.deathdate.substring(0, 4) : 'н.в.'})` : 'Неизвестный автор',
        country: row.country,
        price: Number(row.price),
        url: row.imageurl,
        description: row.description,
        addedToCart: row.addedtocart || false,
        addedAmount: row.addedamount || 0,
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


  // корзина
  const addToCart = () => {
    if (!book) return;
    const updated = {
      ...book,
      addedToCart: true,
      addedAmount: (book.addedAmount || 0) + 1
    };

    setBook(updated);
    axios.put(`http://localhost:5000/api/books/${book.id}`, updated).catch(console.error);
  };

  const removeFromCart = () => {
    if (!book) return;
    const updatedAmount = Math.max((book.addedAmount || 0) - 1, 0);
    const updated = {
      ...book,
      addedAmount: updatedAmount,
      addedToCart: updatedAmount > 0
    };

    setBook(updated);
    axios.put(`http://localhost:5000/api/books/${book.id}`, updated).catch(console.error);
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

        <p className='descrProd'>Описание: {book.description}</p>
      </motion.div>

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
