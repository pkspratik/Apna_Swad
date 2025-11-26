import React from "react";
import data from "../../API_Data/products.json";

export default function CategoryFromId({ id }) {
  const allCategories = data.categories;

  const foundCategory = allCategories.find((cat) =>
    cat.products.some((p) => p.id.toString() === id.toString())
  );

  if (!foundCategory) {
    return <p>Category not found</p>;
  }

  return <p>Category: <strong>{foundCategory.category}</strong></p>;
}
