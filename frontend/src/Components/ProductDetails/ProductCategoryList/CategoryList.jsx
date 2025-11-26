import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryList.css";
import { NevBar } from "../../Heder_Nev/NevBar";
import { Footer } from "../../Footer/Footer";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const API_URL = "https://api.jsonbin.io/v3/b/6917cd0843b1c97be9ae24fc";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        setCategories(json.record.categories);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (category) => {
    navigate(`/category/${category}`);
  };

  if (!categories.length) return <p className="loader">Loading categories...</p>;

  return (
    <div className="category-container">

      {/* Nev Bar */}
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <h2 className="category-title">🍽 Choose Your Category</h2>

      <div className="category-grid">
        {categories.map((item) => (
          <div
            key={item.category}
            className="category-card"
            onClick={() => handleClick(item.category)}
          >
            <img src={item.products[0].img} alt={item.category} />
            <h3>{item.category}</h3>
          </div>
        ))}
      </div>
      

      {/* End of Footer */}
      <Footer />


    </div>
  );
};

export default CategoryList;
