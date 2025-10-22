import React from 'react';

const Form = ({
  children,
  onSubmit,
  loading = false,
  error = '',
  submitLabel,
  loadingLabel,
  formClassName = 'form',
  buttonClassName = 'formButton',
  errorClassName = 'formError',
  formRef
}) => {
  return (
    <form className={formClassName} ref={formRef} onSubmit={onSubmit}>
      {children}
      {error && <div className={errorClassName} role="alert">{error}</div>}
      <button className={buttonClassName} type="submit" disabled={loading}>
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
};

export default Form;


