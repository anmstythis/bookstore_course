import React from "react";
import AddEntity from "../components/AddEntity.js";

const AddCategory = () => {
  return (
    <AddEntity
      title="Добавить категорию"
      description="Создайте новую категорию книг"
      apiPath="/categories"
      fields={[
        {
          name: "name",
          label: "Название категории",
          type: "text",
          required: true,
        },
      ]}
    />
  );
};

export default AddCategory;
