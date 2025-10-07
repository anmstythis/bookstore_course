import React, {useState} from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Card from '../components/CardMain.js';
import { motion } from "framer-motion"


const Catalogue = () => {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const createFilterTerm = (genre) => {
        const g = (genre || '').toLowerCase();
        return searchTerm === ""
        ? d => (d.genre || '').toLowerCase() === g
        : d => (d.genre || '').toLowerCase() === g && d.name.toLowerCase().includes(searchTerm.toLowerCase());
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
                        <li className='redirect'><a className='redirect' href='#classic'>Классическая литература</a></li>
                        <li className='redirect'><a className='redirect' href='#modern'>Современная литература</a></li>
                        <li className='redirect'><a className='redirect' href='#manga'>Манга</a></li>
                        <li className='redirect'><a className='redirect' href='#comics'>Комиксы</a></li>
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
                    <div id="classic">
                        <Card
                            head = "Классические произведения"    
                            term = {createFilterTerm("Классика")}
                            route=""       
                        />
                    </div>
                    <div id="modern">
                        <Card
                            head = "Современная литература"    
                            term = {createFilterTerm("Современная литература")}  
                            route=""        
                        />
                    </div>
                    <div id="manga">
                        <Card
                            head = "Манга"    
                            term = {createFilterTerm("Манга")}   
                            route=""       
                        />
                    </div>
                    <div id="comics">
                        <Card
                            head = "Комиксы"    
                            term = {createFilterTerm("Комиксы")} 
                            route=""        
                        />
                    </div>
                </motion.div>
            </div>
            <Footer/>
        </div>
    );
};

export default Catalogue