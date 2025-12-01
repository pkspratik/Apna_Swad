
// import React, { useRef, useState, useEffect } from "react";
// import "./FoodCategory.css";

// export function FoodCategory() {
//   const scrollRef = useRef();
//   const [categories, setCategories] = useState([]);

//   // Fetch data from JSONBin
//   useEffect(() => {
//     fetch("https://api.jsonbin.io/v3/b/6917b9b4d0ea881f40e8fa36")
//       .then((res) => res.json())
//       .then((data) => {
//         setCategories(data.record); // Contains name, img, category
//       })
//       .catch((err) => console.error("API ERROR:", err));
//   }, []);

//   const scroll = (direction) => {
//     if (direction === "left") scrollRef.current.scrollLeft -= 300;
//     else scrollRef.current.scrollLeft += 300;
//   };

//   // ==========================================
//   // 🔥 HANDLE CATEGORY CLICK
//   // ==========================================
//   const handleCategoryClick = (clickedCategory) => {
//     alert(`You opened category: ${clickedCategory}`);

//     // Later we will navigate category-wise
//     // navigate(`/category/${clickedCategory}`)
//   };

//   return (
//     <div className="category-container">
//       <h2 className="category-title">What's on your mind?</h2>

//       <div className="category-list" ref={scrollRef}>
//         {categories.map((cat, i) => (
//           <div
//             className="category-item"
//             key={i}
//             onClick={() => handleCategoryClick(cat.category)}
//             style={{ cursor: "pointer" }}
//           >
//             <div className="category-img-wrapper">
//               <img src={cat.img} alt={cat.name} className="category-img" />
//             </div>
//             <p className="category-name">{cat.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useRef, useState, useEffect } from "react";
import "./FoodCategory.css";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS

export function FoodCategory() {
  const scrollRef = useRef();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();                // ✅ ADD THIS

  // Fetch data from JSONBin
  useEffect(() => {
    fetch("https://api.jsonbin.io/v3/b/6917b9b4d0ea881f40e8fa36")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.record);
      })
      .catch((err) => console.error("API ERROR:", err));
  }, []);

  const scroll = (direction) => {
    if (direction === "left") scrollRef.current.scrollLeft -= 300;
    else scrollRef.current.scrollLeft += 300;
  };

  // =====================================================
  // 🔥 HANDLE CATEGORY CLICK + ROUTING
  // =====================================================
  const handleCategoryClick = (clickedCategory) => {
    navigate(`/category/${clickedCategory}`);   // ✅ ROUTE TO THAT CATEGORY PAGE
  };

  return (
    <div className="category-container">
      <h2 className="category-title">What's on your mind?</h2>

      <div className="category-list" ref={scrollRef}>
        {categories.map((cat, i) => (
          <div
            className="category-item"
            key={i}
            onClick={() => handleCategoryClick(cat.category)}   // 🔥 send real category
            style={{ cursor: "pointer" }}
          >
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


