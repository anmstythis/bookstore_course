import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardItem from './CardItem.js';

const Card = ({ head, term, route }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [booksRes, authorsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/books'),
        axios.get('http://localhost:5000/api/authors')
      ]);

      const authors = authorsRes.data || [];

      const mapped = (booksRes.data || []).map(row => {
        const author = authors.find(a => a.id_author === row.author_id);

        return {
          id: row.id_book,
          name: row.title,
          authorId: row.author_id,
          author: author ? `${author.firstname} ${author.lastname}` : 'Неизвестный автор',
          price: Number(row.price),
          url: row.imageurl,
          categoryId: row.category_id,
          addedToCart: false,
          addedAmount: 0,
          isFavorite: false
        };
      });

      setData(mapped);
      console.log("Полученные книги:", mapped);
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
    }
  };

  fetchData();
}, []);


  const addToCart = (id) => {
    setData(prev => prev.map(item =>
      item.id === id
        ? { ...item, addedToCart: true, addedAmount: item.addedAmount + 1 }
        : item
    ));
  };

  const removeFromCart = (id) => {
    setData(prev => prev.map(item =>
      item.id === id
        ? {
            ...item,
            addedAmount: Math.max(item.addedAmount - 1, 0),
            addedToCart: item.addedAmount - 1 > 0
          }
        : item
    ));
  };

  const becomeFavorite = (id) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const filteredData = typeof term === 'function' ? data.filter(term) : data;

  return (
    <div>
      <u><header className="head">{head}</header></u>
      <div className="cards">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <CardItem
              key={item.id}
              item={item}
              becomeFavorite={becomeFavorite}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              changePrice={route === "cart"}
            />
          ))
        ) : (
          <h3 className='find'>
            Нет книг.
          </h3>
        )}
      </div>
    </div>
  );
};

export default Card;
