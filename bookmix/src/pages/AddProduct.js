import React from "react";
import AddEntity from "../components/AddEntity.js";

const AddProduct = () => (
  <AddEntity
    title="Добавить книгу"
    description="Здесь вы можете добавлять товары"
    apiPath="/books"
    fields={[
      { name: "title", label: "Название", type: "text", required: true },
      { name: "description", label: "Описание", type: "textarea" },
      { name: "publishdate", label: "Дата публикации", type: "date" },
      { name: "author_id", label: "Автор", type: "select", source: "/authors", getLabel: (a) => `${a.firstname} ${a.lastname}` },
      { name: "publisher_id", label: "Издатель", type: "select", source: "/publishers", getLabel: (p) => p.legalname },
      { name: "category_id", label: "Категория", type: "select", source: "/categories", getLabel: (c) => c.name },
      { name: "price", label: "Цена (₽)", type: "number", required: true },
      { name: "quantity", label: "Количество", type: "number", required: true },
      { name: "imageurl", label: "URL изображения", type: "text" },
    ]}
  />
);

export default AddProduct;
