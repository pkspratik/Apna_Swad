// import React, { useRef } from "react";
// import "./FoodCategory.css";

// const categories = [
//   { name: "Biryani", img: "https://i.pinimg.com/736x/ce/99/19/ce9919d8c596f8d0d68c14ac5bb3693d.jpg" },
//   { name: "Paneer", img: "https://png.pngtree.com/png-clipart/20250121/original/pngtree-kadai-paneer-on-white-background-png-image_20126054.png" },
//   { name: "Pizzas", img: "https://www.freeiconspng.com/uploads/pizza-png-1.png" },
//   { name: "North Indian", img: "https://png.pngtree.com/png-clipart/20250116/original/pngtree-deluxe-indian-cuisine-thali-with-curries-png-image_20237450.png" },
//   { name: "Mushroom", img: "https://e7.pngegg.com/pngimages/273/661/png-clipart-curry-karahi-shahi-paneer-indian-cuisine-gravy-mushroom-food-recipe-thumbnail.png" },
//   { name: "Burgers", img: "https://png.pngtree.com/png-vector/20250121/ourlarge/pngtree-burger-isolated-transparent-background-png-image_15296529.png" },

//   { name: "Hot Drink", img: "https://png.pngtree.com/png-vector/20241203/ourlarge/pngtree-coffee-cup-transparent-background-png-image_14596291.png" },
//   { name: "Cold drink", img: "https://p7.hiclipart.com/preview/820/177/275/5bbcd5ac89439-thumbnail.jpg" },
//   { name: "Snacks", img: "https://png.pngtree.com/png-vector/20241213/ourlarge/pngtree-snacks-png-image_14743131.png" },
//   { name: "Sweets", img: "https://static.vecteezy.com/system/resources/thumbnails/071/295/002/small/clay-pot-filled-with-sweet-rasgulla-isolated-on-transparent-background-png.png" },
  
// ];

// export function FoodCategory() {
//   const scrollRef = useRef();

//   const scroll = (direction) => {
//     if (direction === "left") scrollRef.current.scrollLeft -= 300;
//     else scrollRef.current.scrollLeft += 300;
//   };

//   return (
//     <div className="category-container">
//       <h4 className="category-title">What's your choise 🤔 ?</h4>
//       <div className="scroll-buttons">
//         <button onClick={() => scroll("left")} className="scroll-btn">◀</button>
//         <button onClick={() => scroll("right")} className="scroll-btn">▶</button>
//       </div>

//       <div className="category-list" ref={scrollRef}>
//         {categories.map((cat, i) => (
//           <div className="category-item" key={i}>
//             <img src={cat.img} alt={cat.name} className="category-img" />
//             <p>{cat.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




import React, { useRef } from "react";
import "./FoodCategory.css";

const categories = [
    { name: "Biryani", img: "https://i.pinimg.com/736x/ce/99/19/ce9919d8c596f8d0d68c14ac5bb3693d.jpg" },
  { name: "Paneer", img: "https://png.pngtree.com/png-clipart/20250121/original/pngtree-kadai-paneer-on-white-background-png-image_20126054.png" },
  { name: "Pizzas", img: "https://www.freeiconspng.com/uploads/pizza-png-1.png" },
  { name: "North Indian", img: "https://png.pngtree.com/png-clipart/20250116/original/pngtree-deluxe-indian-cuisine-thali-with-curries-png-image_20237450.png" },
  { name: "Mushroom", img: "https://e7.pngegg.com/pngimages/273/661/png-clipart-curry-karahi-shahi-paneer-indian-cuisine-gravy-mushroom-food-recipe-thumbnail.png" },
  { name: "Burgers", img: "https://png.pngtree.com/png-vector/20250121/ourlarge/pngtree-burger-isolated-transparent-background-png-image_15296529.png" },

  { name: "Hot Drink", img: "https://png.pngtree.com/png-vector/20241203/ourlarge/pngtree-coffee-cup-transparent-background-png-image_14596291.png" },
  { name: "Cold drink", img: "https://p7.hiclipart.com/preview/820/177/275/5bbcd5ac89439-thumbnail.jpg" },
  { name: "Snacks", img: "https://png.pngtree.com/png-vector/20241213/ourlarge/pngtree-snacks-png-image_14743131.png" },
  { name: "Sweets", img: "https://static.vecteezy.com/system/resources/thumbnails/071/295/002/small/clay-pot-filled-with-sweet-rasgulla-isolated-on-transparent-background-png.png" },
];

export function FoodCategory() {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (direction === "left") scrollRef.current.scrollLeft -= 300;
    else scrollRef.current.scrollLeft += 300;
  };

  return (
    <div className="category-container">
      <h2 className="category-title">What's on your mind?</h2>

      <div className="scroll-buttons">
        <button onClick={() => scroll("left")} className="scroll-btn">←</button>
        <button onClick={() => scroll("right")} className="scroll-btn">→</button>
      </div>

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

