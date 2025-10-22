import React from 'react';
import Card from '../components/CardMain.js';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';

const Favorites = () => {
    return (
        <div>
            <Header
                title="Избранное"
                description="Ваши любимые произведения находятся здесь!"
            />
            <Card
                term = {d => d.isFavorite === true}
                route=""  
            />
            <Footer/>
        </div>
    );
};

export default Favorites