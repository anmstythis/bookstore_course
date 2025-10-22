import React, { useRef, useState, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import Form from './Form.js';

const EmailForm = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const storedUser = useMemo(() => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const initialName = useMemo(() => storedUser?.firstname || '', [storedUser]);

  const initialEmail = useMemo(() => storedUser?.email || '', [storedUser]);

  const [fromName, setFromName] = useState(initialName);
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    emailjs
      .sendForm('service_uxm8tuo', 'template_f61t835' , form.current, {
        publicKey: '1onkU7pJ5wv212QU9',
      })
      .then(
        () => {
          console.log('УСПЕШНО!');
          alert('Письмо успешно отправлено.');
          setMessage('');
        },
        (error) => {
          console.log('ПРОВАЛЬНО...', error.text);
          setError("Не удалось отправить письмо.");
          alert('Не удалось отправить письмо. Пожалуйста, попробуйте позже.');
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form
      formRef={form}
      onSubmit={sendEmail}
      loading={loading}
      error={error}
      submitLabel={'Отправить'}
      loadingLabel={'Отправляем...'}
    >
      <label className='formLabel'>Ваше имя</label>
      <input
        className='formInput'
        type="text"
        name="from_name"
        value={fromName}
        onChange={(e) => setFromName(e.target.value)}
      />
      <label className='formLabel'>Ваш Email</label>
      <input
        className='formInput'
        type="email"
        name="user_email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />
      <label className='formLabel'>Содержимое вопроса</label>
      <textarea
        className='formInput'
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </Form>
  );
};

export default EmailForm;