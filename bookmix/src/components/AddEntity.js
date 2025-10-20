import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosSetup.js";
import Header from "../components/Header.js";
import Form from "../components/Form.js";

const AddEntity = ({ title, description, apiPath, fields, customSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const results = await Promise.all(
          fields
            .filter((f) => f.type === "select" && f.source)
            .map((f) => api.get(f.source))
        );

        const optionsData = {};
        results.forEach((res, index) => {
          const fieldName = fields.filter((f) => f.type === "select")[index].name;
          optionsData[fieldName] = res.data;
        });

        setOptions(optionsData);
      } catch (err) {
        console.error("Ошибка загрузки списков:", err);
        setError("Не удалось загрузить данные для выбора");
      }
    };

    fetchOptions();
  }, [fields]);


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (customSubmit) {
        await customSubmit(form, navigate, setError, setLoading);
      } else {
        await api.post(apiPath, form);
        navigate(-1);
      }
    } catch (err) {
      console.error("Ошибка добавления:", err);
      setError("Не удалось добавить запись");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Header title={title} description={description} />
      <div className="formContainer">
        <Form
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel="Сохранить"
          loadingLabel="Сохранение..."
          formClassName="form"
          buttonClassName="formButton"
        >
          {fields.map((field) => (
            <>
              <label className="formLabel">{field.label}</label>

              {field.type === "textarea" ? (
                <textarea
                  className="formInput"
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  rows="3"
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <select
                  className="formInput"
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">Выберите...</option>
                  {(options[field.name] || []).map((opt) => (
                    <option key={opt.id_author || opt.id_publisher || opt.id_category || opt.id} value={opt.id_author || opt.id_publisher || opt.id_category || opt.id}>
                      {field.getLabel ? field.getLabel(opt) : opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="formInput"
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              )}
            </>
          ))}

          {form.imageurl && (
            <img src={form.imageurl} alt="Превью" className="card-img-top" />
          )}
        </Form>
      </div>
    </div>
  );
};

export default AddEntity;
