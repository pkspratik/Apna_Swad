// import React from "react";
// import "./Breakfast.css";

// const restaurants = [
//   {
//     name: "Puri Sabzi",
//     img: "https://png.pngtree.com/png-vector/20250416/ourmid/pngtree-delicious-indian-chole-bhature-platter-spicy-chickpea-curry-puri-bread-png-image_16032378.png",
//     offer: "₹40 OFF USE WELCOME40",
//     price: "₹99",
//     desc: "A rich medley of spices with fresh puri. Delicious, soft and satisfying.",
//   },
//   {
//     name: "Chole Bhature",
//     img: "https://static.vecteezy.com/system/resources/previews/057/733/355/non_2x/chole-bhature-isolated-on-transparent-background-png.png",
//     offer: "₹50 OFF USE FOOD50",
//     price: "₹125",
//     desc: "Classic North Indian chole bhature with rich gravy and soft bhature.",
//   },
//   {
//     name: "Masala Dosa",
//     img: "https://i.pinimg.com/736x/e9/61/c8/e961c86ba7e92618c20a6dca4e235758.jpg",
//     offer: "40% OFF UPTO ₹70",
//     price: "₹85",
//     desc: "Crispy masala dosa filled with flavourful potato stuffing.",
//   },
//   {
//     name: "Litti Chokha",
//     img: "https://w7.pngwing.com/pngs/977/183/png-transparent-litti-chokha.png",
//     offer: "₹50 OFF",
//     price: "₹99",
//     desc: "Authentic Bihari litti served with smoky chokha.",
//   },
// ];

// export function Breakfast() {
//   return (
//     <div className="list-view-container">
//       <h2 className="section-title">🍽️ Breakfast — What’s Your Choice?</h2>

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

export function Breakfast() {
  return <FoodList category="Breakfast" />;
}
