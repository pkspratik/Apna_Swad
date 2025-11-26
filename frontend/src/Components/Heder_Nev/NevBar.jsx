// import { Link } from "react-router-dom";
// import "./NevBar.css";
// import { useCart } from "../../context/CartContext";   // <-- import global cart

// export function NevBar(prop) {

//   const { cart } = useCart(); // <-- get global cart

//   return (
//     <div>
//       <nav className="d-flex justify-content-between align-items-center p-2 m-1 navbar-custom shadow-lg">

//         {/* Brand Title */}
//         <div
//           className="fw-bold rounded-circle d-flex align-items-center justify-content-center"
//           style={{
//             width: "150px",
//             height: "30px",
//             color: "#fff",
//             boxShadow: "0 0 8px rgba(0, 179, 134, 0.8)",
//           }}
//         >
//           <span className="fw-bolder fs-5 text-black-50">{prop.BrandTitle}</span>
//         </div>

//         {/* Menu Items */}
//         <div>
//           {prop.MenuItems &&
//             prop.MenuItems.map((item, index) => (
//               <Link
//                 key={index}
//                 to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
//                 className="navbar-item px-3 mx-1 fw-bold text-decoration-none text-black-50"
//               >
//                 {item}
//               </Link>
//             ))}
//         </div>

//         {/* Search Box + Cart Icon */}
//         <div className="d-flex align-items-center">

//           {/* Search Box */}
//           {/* <div className="input-group me-3" style={{ width: "200px" }}>
//             <input
//               type="text"
//               className="form-control bg-transparent text-white border-0"
//               placeholder="Search"
//             />
//             <button className="btn btn-warning bi bi-search"></button>
//           </div> */}

//           {/* Cart Icon */}
//           <Link
//             to="/cart"
//             className="position-relative text-decoration-none"
//             style={{ fontSize: "24px", color: "#000" }}
//           >
//             🛒
//             {/* Cart Count Badge */}
//             {cart.length > 0 && (
//               <span
//                 className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
//                 style={{ fontSize: "12px" }}
//               >
//                 {cart.length}
//               </span>
//             )}
//           </Link>

//         </div>

//       </nav>
//     </div>
//   );
// }


import { Link } from "react-router-dom";
import "./NevBar.css";
import { useCart } from "../../context/CartContext";

export function NevBar(prop) {

  const { cart } = useCart(); // global cart

  return (
    <div>
      <nav className="d-flex justify-content-between align-items-center p-2 m-1 navbar-custom shadow-lg">

        {/* Brand Title */}
        <div
          className="fw-bold rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "150px",
            height: "30px",
            color: "#fff",
            boxShadow: "0 0 8px rgba(0, 179, 134, 0.8)",
          }}
        >
          <span className="fw-bolder fs-5 text-black-50">{prop.BrandTitle}</span>
        </div>

        {/* Menu Items */}
        <div>
          {prop.MenuItems &&
            prop.MenuItems.map((item, index) => (
              <Link
                key={index}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="navbar-item px-3 mx-1 fw-bold text-decoration-none text-black-50"
              >
                {item}
              </Link>
            ))}
        </div>

        {/* Login + Cart */}
        <div className="d-flex align-items-center gap-3">

          {/* ✅ Modern Rounded Login Icon */}
          <Link
            to="/login"
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "38px",
              height: "38px",
              backgroundColor: "#f1f1f1",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              cursor: "pointer",
              textDecoration: "none",
              color: "#000",
              fontSize: "20px"
            }}
          >
            <i className="bi bi-person"></i>
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="position-relative text-decoration-none"
            style={{ fontSize: "24px", color: "#000" }}
          >
            🛒

            {/* Cart Count Badge */}
            {cart.length > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "12px" }}
              >
                {cart.length}
              </span>
            )}
          </Link>

        </div>

      </nav>
    </div>
  );
}
