import './App.css';
import React from 'react';
import Home from './pages/Home.js';
import Catalogue from './pages/Catalogue.js';
import {Routes, Route, Navigate} from "react-router-dom";
import Favorites from './pages/Favorites.js';
import ProductInfo from './pages/ProductInfo.js';
import Cart from './pages/Cart.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Account from './pages/Account.js'
import PasswordReset from './pages/PasswordReset.js';
import DeleteAccountConfirm from './pages/DeleteAccountConfirm.js';
import Orders from './pages/Orders.js';
import OrderDetails from './pages/OrderDetails.js';
import Reports from './pages/Reports.js'


class App extends React.Component
{
  render(){
    const user = localStorage.getItem('user');
    return(
      <div>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace/>}/>
          <Route path="/catalogue" element={<Catalogue />}/>
          <Route path="/favorites" element={<Favorites />}/>
          <Route path="/product/:id" element={<ProductInfo />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace/>}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/account" element={<Account />}/>
          <Route path="/account/delete" element={<DeleteAccountConfirm />}/>
          <Route path="/reset-password" element={<PasswordReset/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/orders/:id" element={<OrderDetails/>}/>
          <Route path="/reports" element={<Reports/>}/>
        </Routes>
      </div>
    )
  }
}

export default App;
