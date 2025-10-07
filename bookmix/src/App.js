import './App.css';
import React, {UseState} from 'react';
import Home from './pages/Home.js';
import Catalogue from './pages/Catalogue.js';
import {Routes, Route} from "react-router-dom";
import Favorites from './pages/Favorites.js';
import ProductInfo from './pages/ProductInfo.js';
import Cart from './pages/Cart.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';


class App extends React.Component
{
  render(){
    return(
      <div>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/catalogue" element={<Catalogue />}/>
          <Route path="/favorites" element={<Favorites />}/>
          <Route path="/product/:id" element={<ProductInfo />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
        </Routes>
      </div>
    )
  }
}

export default App;
