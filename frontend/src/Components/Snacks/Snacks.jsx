// import React from "react";
// import "./Snacks.css";

// const restaurants = [
//   {
//     name: "Pizza",
//     img: "https://www.freeiconspng.com/uploads/pizza-png-1.png",
//     offer: "ITEMS AT ₹89",
//     rating: "4.3",
//     time: "25-30 mins",
//     category: "Pizzas, Pastas, Italian, Desserts",
//     location: "Patliputra Colony",
//   },
//   {
//     name: "Cold & Hot Drink",
//     img: "https://png.pngtree.com/png-vector/20241213/ourlarge/pngtree-snacks-png-image_14743131.png",
//     offer: "ITEMS AT ₹119",
//     rating: "4.0",
//     time: "25-30 mins",
//     category: "Pizzas, Snacks",
//     location: "Lodipur",
//   },
//   {
//     name: "Burger",
//     img: "https://png.pngtree.com/png-vector/20250121/ourlarge/pngtree-burger-isolated-transparent-background-png-image_15296529.png",
//     offer: "40% OFF UPTO ₹80",
//     rating: "4.5",
//     time: "20-25 mins",
//     category: "Desserts, Ice Cream",
//     location: "Srikrishnapuri",
//   },
//   {
//     name: "Pani Puri",
//     img: "https://png.pngtree.com/png-vector/20250126/ourmid/pngtree-indian-street-food-pani-puri-golgappa-round-hd-image-png-image_15337745.png",
//     offer: "ITEMS AT ₹30",
//     rating: "4.2",
//     time: "30-35 mins",
//     category: "Beverages, Cafe",
//     location: "Patliputra Colony",
//   },
// ];

// export function Snacks() {
//    return (
//     <div className="list-view-container">
//       <h2 className="section-title">🍽️ Snacks — Please choose</h2>

//       {restaurants.map((item, index) => (
//         <div className="list-card" key={index}>
//           <div className="left-section">
//             <h3 className="item-name">{item.name}</h3>

//             <p className="price">
//               <span className="price-main">{item.price}</span>
//               <span className="offer-text"> 💚 {item.offer}</span>
//             </p>

//             <p className="description">{item.desc}</p>

//             <hr className="divider" />
//           </div>

//           <div className="right-section">
//             <img src={item.img} alt={item.name} className="item-image" />

//             <button className="add-btn">ADD</button>
//             <p className="customizable">Customisable</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import { FoodList } from "../FoodList/FoodList";

export function Snacks() {
  return <FoodList category="Snacks" />;
}

