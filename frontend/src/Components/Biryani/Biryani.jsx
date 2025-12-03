import React, { useState, useEffect } from "react";
import "./Biryani.css";

export function Biryani() {

  // const biryaniItems = [
  //   { name: "Chicken Biryani", type: "nonveg", price: 120, img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/chicken-biryani.jpg" },
  //   { name: "Mutton Biryani", type: "nonveg", price: 160, image: "/images/mutton-biryani.png" },
  //   { name: "Egg Biryani", type: "nonveg", price: 90, image: "/images/egg-biryani.png" },
  //   { name: "Veg Biryani", type: "veg", price: 100, image: "/images/veg-biryani.png" },
  //   { name: "Paneer Biryani", type: "veg", price: 130, image: "/images/paneer-biryani.png" }, { name: "mushroom Biryani", type: "veg", price: 130, image: "/images/mushroom-biryani.png" }
  // ];

  const biryaniItems = [
    {
      name: "Chicken Biryani",
      type: "nonveg",
      price: 120,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/chicken-biryani.jpg"
    },
    {
      name: "Mutton Biryani",
      type: "nonveg",
      price: 160,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/mutton-biryani.jpg"
    },
    {
      name: "Egg Biryani",
      type: "nonveg",
      price: 90,
      img: "https://i.pinimg.com/originals/aa/39/2a/aa392a9ca3460d7437819fb4cc8ca7f4.jpg"
    },
    {
      name: "Veg Biryani",
      type: "veg",
      price: 100,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/veg-biryani.jpg"
    },
    {
      name: "Paneer Biryani",
      type: "veg",
      price: 130,
      img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/paneer-biryani.jpg"
    },
  ];


  const [filter, setFilter] = useState("all");
  const [list, setList] = useState(biryaniItems);

  useEffect(() => {
    if (filter === "all") {
      setList(biryaniItems);
    } else {
      setList(biryaniItems.filter(item => item.type === filter));
    }
  }, [filter]);

  return (
    <div className="biryani-container">

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          All
        </button>

        <button className={filter === "veg" ? "active veg" : "veg"} onClick={() => setFilter("veg")}>
          Veg
        </button>

        <button className={filter === "nonveg" ? "active nonveg" : "nonveg"} onClick={() => setFilter("nonveg")}>
          Non-Veg
        </button>
      </div>

      {/* Cards */}
      <div className="biryani-grid">
        {list.map((item, index) => (
          <div className="biryani-card" key={index}>

            <img src={item.image} alt={item.name} />

            <p className="title">{item.name}</p>

            <p className="price">₹{item.price}</p>

            <button className="add-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
