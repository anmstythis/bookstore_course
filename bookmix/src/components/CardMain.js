import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardItem from './CardItem.js';

const Card = ({ head, term, route }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then(res => {
        const mapped = res.data.map(row => ({
          id: row.id_book,
          name: row.title,
          author: row.author,
          price: Number(row.price),
          url: row.imageurl,
          genre: row.category,
          addedToCart: false,
          addedAmount: 0,
          isFavorite: false
        }));
        setData(mapped);
      })
      .catch(err => console.log(err));
  }, []);

  const addToCart = (id) => {
    const current = data.find(item => item.id === id);
    if (!current) return;
    const updated = {
      ...current,
      addedToCart: true,
      addedAmount: (current.addedAmount || 0) + 1
    };
    setData(data.map(item => item.id === id ? updated : item));
  };

  const becomeFavorite = (id) => {
    const current = data.find(item => item.id === id);
    if (!current) return;
    const updated = { ...current, isFavorite: !current.isFavorite };
    setData(data.map(item => item.id === id ? updated : item));
  };

  const removeFromCart = (id) => {
    const current = data.find(item => item.id === id);
    if (!current) return;
    let updatedAmount = (current.addedAmount || 0) - 1;
    if (updatedAmount < 0) updatedAmount = 0;
    const updated = {
      ...current,
      addedAmount: updatedAmount,
      addedToCart: updatedAmount > 0
    };
    setData(data.map(item => item.id === id ? updated : item));
  };

  return (
    <div>
      <u><header className='head'>{head}</header></u>
      <div className="cards">
        {data.filter(term).map((item, i) => (
          <CardItem
            key={i}
            item={item}
            becomeFavorite={becomeFavorite}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            changePrice={route === "cart" ? true : false}
          />
        ))}
      </div>
    </div>
  );
};

export default Card;
