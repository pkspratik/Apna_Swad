// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import data from "../../API_Data/products.json";
// import "./ProductDetails.css";

// export function ProductDetails() {
//   const navigate = useNavigate();
//   const scrollers = useRef({});
//   const [productGroups, setProductGroups] = useState([]);

//   useEffect(() => {
//     const parsed =
//       data.record?.categories ??
//       data.categories ??
//       [];
//     setProductGroups(parsed);
//   }, []);

//   const groupedCategories = useMemo(() => productGroups, [productGroups]);

//   const handleScroll = (category, direction) => {
//     const node = scrollers.current[category];
//     if (!node) return;

//     const scrollAmount = direction === "left" ? -300 : 300;
//     node.scrollBy({ left: scrollAmount, behavior: "smooth" });
//   };

//   // const handleProductClick = (productId) => {
//   //   navigate(`/product/${productId}`);
//   // };

//   const handleProductClick = (productId, category) => {
//   navigate(`/product/${productId}`, { state: { category } });
// };


//   if (!groupedCategories.length) {
//     return <p style={{ textAlign: "center" }}>Products not available.</p>;
//   }

//   return (
//     <section>
//       {groupedCategories.map((category) => (
//         <div className="category-block" key={category.category}>
//           <div className="header">
//             <h2>{category.title}</h2>

//             <div className="nav-btns">
//               <button
//                 className="scroll-btn"
//                 type="button"
//                 onClick={() => handleScroll(category.category, "left")}
//                 aria-label={`Scroll ${category.title} left`}
//               >
//                 ‹
//               </button>
//               <button
//                 className="scroll-btn"
//                 type="button"
//                 onClick={() => handleScroll(category.category, "right")}
//                 aria-label={`Scroll ${category.title} right`}
//               >
//                 ›
//               </button>
//             </div>
//           </div>

//           <div
//             className="product-list"
//             ref={(el) => {
//               scrollers.current[category.category] = el;
//             }}
//           >
//             {category.products.map((product) => (
              
//               <article
//                 className="product-card"
//                key={product.id}
//                 onClick={() => handleProductClick(product.id, category.category)}
//                >

              
              
              
//               {/* // <article
//               //   className="product-card"
//               //   key={product.id}
//               //   onClick={() => handleProductClick(product.id)}
//               // > */}

              
//                 <div className="image-container">
//                   <img src={product.img} alt={product.name} />
//                   <span className="offer">{product.offerText}</span>
//                 </div>

//                 <div className="product-info">
//                   <h4>{product.name}</h4>
//                   <p className="rating">⭐ {product.rating}</p>
//                   <p className="category">{category.category}</p>
//                   <p className="location">{product.location}</p>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// }

// export default ProductDetails;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../../API_Data/products.json";
import "./ProductDetails.css";

export function ProductDetails() {
  const navigate = useNavigate();
  const scrollers = useRef({});
  const [productGroups, setProductGroups] = useState([]);

  useEffect(() => {
    const parsed =
      data.record?.categories ??
      data.categories ??
      [];
    setProductGroups(parsed);
  }, []);

  const groupedCategories = useMemo(() => productGroups, [productGroups]);

  const handleScroll = (category, direction) => {
    const node = scrollers.current[category];
    if (!node) return;

    const scrollAmount = direction === "left" ? -300 : 300;
    node.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // NEW: navigate to category instead of product
  const handleCategoryOpen = (category) => {
    navigate(`/category/${category}`);
  };

  if (!groupedCategories.length) {
    return <p style={{ textAlign: "center" }}>Products not available.</p>;
  }

  return (
    <section>
      {groupedCategories.map((category) => (
        <div className="category-block" key={category.category}>
          <div className="header">
            <h2>{category.title}</h2>

            <div className="nav-btns">
              <button
                className="scroll-btn"
                type="button"
                onClick={() => handleScroll(category.category, "left")}
                aria-label={`Scroll ${category.title} left`}
              >
                ‹
              </button>
              <button
                className="scroll-btn"
                type="button"
                onClick={() => handleScroll(category.category, "right")}
                aria-label={`Scroll ${category.title} right`}
              >
                ›
              </button>
            </div>
          </div>

          <div
            className="product-list"
            ref={(el) => {
              scrollers.current[category.category] = el;
            }}
          >
            {category.products.map((product) => (
              <article
                className="product-card"
                key={product.id}
                onClick={() => handleCategoryOpen(category.category)}
              >
                <div className="image-container">
                  <img src={product.img} alt={product.name} />
                  <span className="offer">{product.offerText}</span>
                </div>

                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="rating">⭐ {product.rating}</p>
                  <p className="category">{category.category}</p>
                  <p className="location">{product.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default ProductDetails;

