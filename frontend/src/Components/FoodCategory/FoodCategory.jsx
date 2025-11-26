import React, { useRef, useState, useEffect } from "react";
import "./FoodCategory.css";

export function FoodCategory() {
  const scrollRef = useRef();
  const [categories, setCategories] = useState([]);

  // Fetch data from JSONBin
  useEffect(() => {
    fetch("https://api.jsonbin.io/v3/b/6917b9b4d0ea881f40e8fa36")  // <-- YOUR BIN URL
      .then(res => res.json())
      .then(data => {
        setCategories(data.record); // JSONBin stores actual JSON inside "record"
      })
      .catch(err => console.error("API ERROR:", err));
  }, []);

  const scroll = (direction) => {
    if (direction === "left") scrollRef.current.scrollLeft -= 300;
    else scrollRef.current.scrollLeft += 300;
  };

  return (
    <div className="category-container">
      <h2 className="category-title">What's on your mind?</h2>

      {/* <div className="scroll-buttons">
        <button onClick={() => scroll("left")} className="scroll-btn">←</button>
        <button onClick={() => scroll("right")} className="scroll-btn">→</button>
      </div> */}

      <div className="category-list" ref={scrollRef}>
        {categories.map((cat, i) => (
          <div className="category-item" key={i}>
            <div className="category-img-wrapper">
              <img src={cat.img} alt={cat.name} className="category-img" />
            </div>
            <p className="category-name">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
