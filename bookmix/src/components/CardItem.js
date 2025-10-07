import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CardItem = ({ item, becomeFavorite, addToCart, removeFromCart, changePrice}) => {
  const navigate = useNavigate();

  const handleButtonClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="card">
      <img className="card-img-top" src={item.url} alt={item.name} />
      <button className={item.isFavorite ? 'favButton' : 'notFavButton'} onClick={() => becomeFavorite(item.id)}>❤</button>
      <h3 className="card-title">{item.name}</h3>
      <button className='infoButton' onClick={() => handleButtonClick(item.id)}>🛈</button>
      <p className="card-text">{item.author}</p>
      <h2 className='price'>{item.addedAmount != 0 && changePrice === true ? item.price * item.addedAmount : item.price} руб.</h2>
      <div className='buttons'>
        <button className='cartButton' onClick={() => addToCart(item.id)}>+</button>
        <button className='cartButton' onClick={() => removeFromCart(item.id)}>-</button>
      </div>
    </div>
  );
};

export default CardItem;
