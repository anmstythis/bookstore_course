import Card from "../components/CardMain.js";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import EmailForm from "../components/EmailForm.js";


class Home extends React.Component
{
    render(){
        return(
          <div>
            <Header
              title="Вас приветствует BookMix!"
              description= "Здесь вы найдете любые книги: от классических произведений до современной литературы! Здесь есть даже манга и комиксы!"
            />
            <motion.div
              initial={{x:-1000, opacity:0}}
              animate={{x:0, opacity:1}}
              transition={{ delay:0.5, duration:1.5}}
            >
              <Card
                head = "Бестселлеры" 
                term={(book, index, array) => array.indexOf(book) >= array.length - 4}     
                route=""   
              />
              <footer className='foot'>
                Больше произведений вы найдете в <Link className='navigate' to="/catalogue">Каталоге</Link>
              </footer>

              <header className="welcome">Есть вопросы? Свяжитесь с нами!</header>
              <EmailForm/>
            </motion.div>
            <Footer/>
          </div>
        )
      }
}

export default Home;
