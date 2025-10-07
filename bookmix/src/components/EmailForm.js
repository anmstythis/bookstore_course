import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Form from './Form.js';

const EmailForm = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    emailjs
      .sendForm('service_wxubcei', 'template_f61t835' , form.current, {
        publicKey: '1onkU7pJ5wv212QU9',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
          setError("Не удалось отправить письмо.");
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
      <input className='formInput' type="text" name="from_name" />
      <label className='formLabel'>Ваш Email</label>
      <input className='formInput' type="email" name="user_email" />
      <label className='formLabel'>Содержимое вопроса</label>
      <textarea className='formInput' name="message" />
    </Form>
  );
};

export default EmailForm;