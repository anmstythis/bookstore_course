import React from "react";
import AddEntity from "../components/AddEntity.js";

const AddAuthor = () => (
  <AddEntity
    title="Добавить автора"
    description="Здесь вы можете добавить нового автора"
    apiPath="/authors"
    fields={[
      { name: "lastname", label: "Фамилия", type: "text", required: true },
      { name: "firstname", label: "Имя", type: "text", required: true },
      { name: "patronymic", label: "Отчество", type: "text" },
      { name: "birthdate", label: "Дата рождения", type: "date" },
      { name: "deathdate", label: "Дата смерти", type: "date" },
    ]}
  />
);

export default AddAuthor;
