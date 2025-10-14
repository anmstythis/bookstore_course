import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Card from '../components/CardMain.js';
import { motion } from "framer-motion"


const Catalogue = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/categories')
            .then(res => setCategories(res.data || []))
            .catch(err => console.log(err));
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

   const createFilterTerm = (categoryId, search) => {
        const normalizedSearch = (search || '').trim().toLowerCase();
        return (book) => {
            const inCategory = book.categoryId === categoryId;
            if (!normalizedSearch) return inCategory;

            const nameMatches = (book.name || '').toLowerCase().includes(normalizedSearch);
            return inCategory && (nameMatches);
        };
    };


    
    return (
        <div>
            <Header
                title="Каталог"
                description="Здесь вы найдете все произведения!"
            />
            <div className='cataloguePage'>
                <motion.div className='listBooks'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    transition={{ delay: 0.5, duration: 1.5 }}
                >

                    <input className='findPanel' id="search" type='text' value={searchTerm} onChange={handleSearchChange}></input>
                       
                    <ul>
                        {categories.map(cat => (
                            <li key={cat.id_category} className='redirect'>
                                <a className='redirect' href={`#cat-${cat.id_category}`}>{cat.name}</a>
                            </li>
                        ))}
                    </ul>
                </motion.div>
                <motion.div
                    initial={{x: 1000,
                        opacity:0}}
                        animate={{
                          x:0,
                          opacity:1
                        }}
                        transition={{
                          delay:0.5,
                          duration:1.5,
                
                        }}
                >
                    {categories.map(cat => (
                        <div key={cat.id_category} id={`cat-${cat.id_category}`}>
                            <Card
                                head={cat.name}
                                term={createFilterTerm(cat.id_category, searchTerm)}
                                route=""
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
            <Footer/>
        </div>
    );
};

export default Catalogue