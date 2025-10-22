import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import api from "../axiosSetup.js";

const Products = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, authorsRes, publishersRes, categoriesRes] =
          await Promise.all([
            api.get("/books"),
            api.get("/authors"),
            api.get("/publishers"),
            api.get("/categories"),
          ]);
        setBooks(booksRes.data);
        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);
        setCategories(categoriesRes.data);

      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        alert("Не удалось загрузить данные.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (item) => {
    setEditingId(
      item.id_book || item.id_author || item.id_publisher || item.id_category
    );
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedItem({});
  };

  const handleInputChange = (field, value) => {
    setEditedItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveChanges(type);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleSaveChanges = async (type) => {
    try {
      let endpoint = "";
      let data = {};

      switch (type) {
        case "books":
          endpoint = `/books/${editedItem.id_book}`;
          data = {
            title: editedItem.title,
            price: editedItem.price,
            quantity: editedItem.quantity,
            description: editedItem.description || "",
            author_id: editedItem.author_id,
            category_id: editedItem.category_id,
            publisher_id: editedItem.publisher_id,
            imageurl: editedItem.imageurl,
          };
          await api.put(endpoint, data);
          setBooks((prev) =>
            prev.map((b) =>
              b.id_book === editedItem.id_book
                ? {
                    ...b,
                    ...editedItem,
                    author_firstname:
                      authors.find((a) => a.id_author === Number(editedItem.author_id))?.firstname || "",
                    author_lastname:
                      authors.find((a) => a.id_author === Number(editedItem.author_id))?.lastname || "",
                    category_name:
                      categories.find((c) => c.id_category === Number(editedItem.category_id))?.name || "",
                    publisher_legalname:
                      publishers.find((p) => p.id_publisher === Number(editedItem.publisher_id))?.legalname ||
                      "",
                  }
                : b
            )
          );
          console.log(books);
          break;

        case "authors":
          endpoint = `/authors/${editedItem.id_author}`;
          data = {
            firstname: editedItem.firstname,
            lastname: editedItem.lastname,
            patronymic: editedItem.patronymic,
            birthdate: editedItem.birthdate,
            deathdate: editedItem.deathdate,
          };
          await api.put(endpoint, data);
          setAuthors((prev) =>
            prev.map((a) =>
              a.id_author === editedItem.id_author ? { ...a, ...editedItem } : a
            )
          );
          break;

        case "publishers":
          let addressId = editedItem.address_id;

          const addressData = {
            indexmail: editedItem.indexmail || null,
            country: editedItem.country || null,
            city: editedItem.city || null,
            street: editedItem.street || null,
            house: editedItem.house || null,
            apartment: editedItem.apartment || null,
          };

          if (addressId) {
            await api.put(`/addresses/${addressId}`, addressData);
          } else {
            const newAddress = await api.post("/addresses", addressData);
            addressId = newAddress.data.id_address;
          }

          endpoint = `/publishers/${editedItem.id_publisher}`;
          data = {
            legalname: editedItem.legalname,
            contactnum: editedItem.contactnum,
            email: editedItem.email,
            address_id: addressId,
          };
          await api.put(endpoint, data);

          setPublishers((prev) =>
            prev.map((p) =>
              p.id_publisher === editedItem.id_publisher
                ? { ...p, ...editedItem, address_id: addressId }
                : p
            )
          );
          break;

        case "categories":
          endpoint = `/categories/${editedItem.id_category}`;
          data = { name: editedItem.name };
          await api.put(endpoint, data);
          setCategories((prev) =>
            prev.map((c) =>
              c.id_category === editedItem.id_category ? { ...c, ...editedItem } : c
            )
          );
          break;

        default:
          break;
      }

      alert("Изменения сохранены.");
      handleCancelEdit();
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert("Не удалось сохранить изменения.");
    }
  };

  const handleDelete = async (endpoint, id, stateSetter) => {
    if (!window.confirm("Вы уверены, что хотите удалить запись?")) return;
    try {
      await api.delete(`/${endpoint}/${id}`);
      stateSetter((prev) =>
        prev.filter(
          (item) =>
            item.id_book !== id &&
            item.id_author !== id &&
            item.id_publisher !== id &&
            item.id_category !== id
        )
      );
      alert("Удалено успешно.");
    } catch (err) {
      console.error("Ошибка при удалении:", err);
      alert("Ошибка при удалении.");
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Загрузка..." description="Пожалуйста, подождите" />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Управление товарами"
        description="Здесь вы можете управлять товарами"
      />

      {/* Переключатель */}
      <div className="formContainer tabButtons">
        <button
          className={`menuItem ${activeTab === "books" ? "activeTab" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          Книги
        </button>
        <button
          className={`menuItem ${activeTab === "authors" ? "activeTab" : ""}`}
          onClick={() => setActiveTab("authors")}
        >
          Авторы
        </button>
        <button
          className={`menuItem ${activeTab === "publishers" ? "activeTab" : ""}`}
          onClick={() => setActiveTab("publishers")}
        >
          Издатели
        </button>
        <button
          className={`menuItem ${activeTab === "categories" ? "activeTab" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Категории
        </button>
      </div>

      {/* Кнопки добавления */}
      <div className="formContainer">
        {activeTab === "books" && (
          <button
            className="menuItem"
            onClick={() => navigate("/products/add-book")}
          >
            ➕ Добавить книгу
          </button>
        )}
        {activeTab === "authors" && (
          <button
            className="menuItem"
            onClick={() => navigate("/products/add-author")}
          >
            ➕ Добавить автора
          </button>
        )}
        {activeTab === "publishers" && (
          <button
            className="menuItem"
            onClick={() => navigate("/products/add-publisher")}
          >
            ➕ Добавить издателя
          </button>
        )}
        {activeTab === "categories" && (
          <button
            className="menuItem"
            onClick={() => navigate("/products/add-category")}
          >
            ➕ Добавить категорию
          </button>
        )}
      </div>

      <div className="tableContainer">
        {/* Книги */}
        {activeTab === "books" && (
          <>
            <h2 className="head">📚 Все книги 📚</h2>
            {books.length === 0 ? (
              <p className="hint">Книги не найдены.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Обложка</th>
                    <th>Название</th>
                    <th>Автор</th>
                    <th>Категория</th>
                    <th>Издатель</th>
                    <th>Цена</th>
                    <th>Количество</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) =>
                    editingId === b.id_book ? (
                      <tr key={b.id_book}>
                        <td>{b.id_book}</td>

                        <td>
                          <input
                            className="formInput"
                            type="text"
                            placeholder="Введите ссылку на изображение"
                            value={editedItem.imageurl || ""}
                            onChange={(e) => handleInputChange("imageurl", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "books")}
                            autoFocus
                          />
                        </td>

                        <td>
                          <input
                            className="formInput"
                            value={editedItem.title || ""}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "books")}
                          />
                        </td>

                        <td>
                          <select
                            className="formInput"
                            value={editedItem.author_id || ""}
                            onChange={(e) => handleInputChange("author_id", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "books")}
                          >
                            {authors.map((a) => (
                              <option key={a.id_author} value={a.id_author}>
                                {a.firstname} {a.lastname}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            className="formInput"
                            value={editedItem.category_id || ""}
                            onChange={(e) => handleInputChange("category_id", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "books")}
                          >
                            {categories.map((c) => (
                              <option key={c.id_category} value={c.id_category}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            className="formInput"
                            value={editedItem.publisher_id || ""}
                            onChange={(e) => handleInputChange("publisher_id", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "books")}
                          >
                            {publishers.map((p) => (
                              <option key={p.id_publisher} value={p.id_publisher}>
                                {p.legalname}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <input
                            className="formInput"
                            type="number"
                            value={editedItem.price || 0}
                            onChange={(e) => handleInputChange("price", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "books")}
                          />
                        </td>

                        <td>
                          <input
                            className="formInput"
                            type="number"
                            value={editedItem.quantity || 0}
                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "books")}
                          />
                        </td>

                        <td>
                          <button className="menuItem" onClick={() => handleSaveChanges("books")}>
                            Сохранить
                          </button>
                          <button className="menuItem" onClick={handleCancelEdit}>
                            Отмена
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={b.id_book}>
                        <td>{b.id_book}</td>
                        <td>
                          {b.imageurl ? (
                            <img src={b.imageurl} alt={b.title} className="bookImage" />
                          ) : (
                            <div className="noImage">Нет фото</div>
                          )}
                        </td>
                        <td>{b.title}</td>
                        <td>{`${b.author_firstname || ""} ${b.author_lastname || ""}`}</td>
                        <td>{b.category_name}</td>
                        <td>
                          {b.publisher_legalname}
                        </td>
                        <td>{b.price} ₽</td>
                        <td>{b.quantity}</td>
                        <td>
                          <button className="menuItem" onClick={() => handleEditClick(b)}>
                            Изменить
                          </button>
                          <button
                            className="menuItemDanger"
                            onClick={() => handleDelete("books", b.id_book, setBooks)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

            )}
          </>
        )}

        {/* Авторы */}
        {activeTab === "authors" && (
          <>
            <h2 className="head">✍️ Все авторы ✍️</h2>
            {authors.length === 0 ? (
              <p className="hint">Авторы не найдены.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Отчество</th>
                    <th>Дата рождения</th>
                    <th>Дата смерти</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((a) =>
                    editingId === a.id_author ? (
                      <tr key={a.id_author}>
                        <td>{a.id_author}</td>
                        <td>
                          <input
                            className="formInput"
                            value={editedItem.lastname || ""}
                            onChange={(e) => handleInputChange("lastname", e.target.value) }
                            onKeyDown={(e) => handleKeyDown(e, "authors")}
                          />
                        </td>
                        <td>
                          <input
                            className="formInput"
                            value={editedItem.firstname || ""}
                            onChange={(e) => handleInputChange("firstname", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "authors")}
                          />
                        </td>
                        <td>
                          <input
                            className="formInput"
                            value={editedItem.patronymic || ""}
                            onChange={(e) => handleInputChange("patronymic", e.target.value) }
                            onKeyDown={(e) => handleKeyDown(e, "authors")}
                          />
                        </td>
                        <td>
                          <input
                            className="formInput"
                            type="date"
                            value={editedItem.birthdate?.slice(0, 10) || ""}
                            onChange={(e) => handleInputChange("birthdate", e.target.value) }
                            onKeyDown={(e) => handleKeyDown(e, "authors")}
                          />
                        </td>
                        <td>
                          <input
                            className="formInput"
                            type="date"
                            value={editedItem.deathdate?.slice(0, 10) || ""}
                            onChange={(e) => handleInputChange("deathdate", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "authors")}
                          />
                        </td>
                        <td>
                          <button
                            className="menuItem"
                            onClick={() => handleSaveChanges("authors")}
                          >
                            Сохранить
                          </button>
                          <button className="menuItem" onClick={handleCancelEdit}>
                            Отмена
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={a.id_author}>
                        <td>{a.id_author}</td>
                        <td>{a.lastname}</td>
                        <td>{a.firstname}</td>
                        <td>{a.patronymic || "—"}</td>
                        <td>
                          {a.birthdate
                            ? new Date(a.birthdate).toLocaleDateString("ru-RU")
                            : "—"}
                        </td>
                        <td>
                          {a.deathdate
                            ? new Date(a.deathdate).toLocaleDateString("ru-RU")
                            : "—"}
                        </td>
                        <td>
                          <button className="menuItem" onClick={() => handleEditClick(a)}>
                            Изменить
                          </button>
                          <button
                            className="menuItemDanger"
                            onClick={() => handleDelete("authors", a.id_author, setAuthors)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Издатели */}
        {activeTab === "publishers" && (
          <>
            <h2 className="head">🏢 Все издатели 🏢</h2>
            {publishers.length === 0 ? (
              <p className="hint">Издатели не найдены.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Адрес</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {publishers.map((p) =>
                    editingId === p.id_publisher ? (
                      <tr key={p.id_publisher}>
                        <td>{p.id_publisher}</td>
                        <td>
                          <input
                            className="formInput"
                            value={editedItem.legalname || ""}
                            onChange={(e) => handleInputChange("legalname", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "publishers")}
                          />
                        </td>
                        <td>
                          <input
                            className="formInput"
                            value={editedItem.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "publishers")}
                          />
                        </td>
                        <td>
                          <input
                            className="formInput"
                            value={editedItem.contactnum || ""}
                            onChange={(e) => handleInputChange("contactnum", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "publishers")}
                          />
                        </td>
                        <td>
                          <div className="addressInputs">
                            <input
                              className="formInput smallInput"
                              placeholder="Индекс"
                              value={editedItem.indexmail || ""}
                              onChange={(e) => handleInputChange("indexmail", e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, "publishers")}
                            />
                            <input
                              className="formInput smallInput"
                              placeholder="Страна"
                              value={editedItem.country || ""}
                              onChange={(e) => handleInputChange("country", e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, "publishers")}
                            />
                            <input
                              className="formInput smallInput"
                              placeholder="Город"
                              value={editedItem.city || ""}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, "publishers")}
                            />
                            <input
                              className="formInput smallInput"
                              placeholder="Улица"
                              value={editedItem.street || ""}
                              onChange={(e) => handleInputChange("street", e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, "publishers")}
                            />
                            <input
                              className="formInput smallInput"
                              placeholder="Дом"
                              value={editedItem.house || ""}
                              onChange={(e) => handleInputChange("house", e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, "publishers")}
                            />
                            <input
                              className="formInput smallInput"
                              placeholder="Кв."
                              value={editedItem.apartment || ""}
                              onChange={(e) => handleInputChange("apartment", e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, "publishers")}
                            />
                          </div>
                        </td>
                        <td>
                          <button
                            className="menuItem"
                            onClick={() => handleSaveChanges("publishers")}
                          >
                            Сохранить
                          </button>
                          <button className="menuItem" onClick={handleCancelEdit}>
                            Отмена
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={p.id_publisher}>
                        <td>{p.id_publisher}</td>
                        <td>{p.legalname}</td>
                        <td>{p.email}</td>
                        <td>{p.contactnum}</td>
                        <td>
                          {p.address_id ? (
                            `${p.indexmail ? p.indexmail + ", " : ""}${
                              p.country ? p.country + ", " : ""
                            }${p.city ? "г. " + p.city + ", " : ""}${
                              p.street ? "ул. " + p.street + ", " : ""
                            }${p.house ? "д. " + p.house : ""}${
                              p.apartment ? ", кв. " + p.apartment : ""
                            }`
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <button className="menuItem" onClick={() => handleEditClick(p)}>
                            Изменить
                          </button>
                          <button
                            className="menuItemDanger"
                            onClick={() =>
                              handleDelete("publishers", p.id_publisher, setPublishers)
                            }
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            )}
          </>
        )}

        {/* Категории */}
        {activeTab === "categories" && (
          <>
            <h2 className="head">📂 Все категории 📂</h2>
            {categories.length === 0 ? (
              <p className="hint">Категории не найдены.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) =>
                    editingId === c.id_category ? (
                      <tr key={c.id_category}>
                        <td>{c.id_category}</td>
                        <td>
                          <input
                            className="formInput"
                            value={editedItem.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "categories")}
                          />
                        </td>
                        <td>
                          <button
                            className="menuItem"
                            onClick={() => handleSaveChanges("categories")}
                          >
                            Сохранить
                          </button>
                          <button className="menuItem" onClick={handleCancelEdit}>
                            Отмена
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={c.id_category}>
                        <td>{c.id_category}</td>
                        <td>{c.name}</td>
                        <td>
                          <button className="menuItem" onClick={() => handleEditClick(c)}>
                            Изменить
                          </button>
                          <button
                            className="menuItemDanger"
                            onClick={() => handleDelete("categories", c.id_category, setCategories)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
