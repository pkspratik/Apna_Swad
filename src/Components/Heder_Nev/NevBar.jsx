import React from "react";
// import { Link } from "react-router-dom";
import './NevBar.css';
export function NevBar(prop) {
  return (
  <div >
    <nav
      className="d-flex justify-content-between align-items-center p-2 m-1 navbar-custom shadow-lg"
    >
      {/* Brand Title */}
      <div
              className="fw-bold rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "150px",
                height: "30px",
                // backgroundColor: "#00B386",
                color: "#fff",
                boxShadow: "0 0 8px rgba(0, 179, 134, 0.8)",
              }}
            >
        <span className="fw-bolder fs-5 text-black-50">{prop.BrandTitle}</span>
      </div>

      {/* Menu Items */}

        {/* <div>
        {prop.MenuItems && prop.MenuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
            // className="mx-2 text-decoration-none text-dark"
            className="navbar-item px-3 mx-1 fw-bold text-decoration-none text-black-50"
          >
            {item}
           </Link>
        ))}
      </div> */}


      <div>
        {prop.MenuItems &&
          prop.MenuItems.map((item, index) => (
            <span
              key={index}
              className="navbar-item px-3 mx-1 fw-bold"
              onClick={() => alert(`${item} clicked`)} // ✅ clickable
            >
              {item}
            </span>
          ))}
      </div>

      {/* Search Box */}
      <div className="input-group" style={{ width: "200px" }}>
        <input
          type="text"
          className="form-control bg-transparent text-white border-0"
          placeholder="Search"
        />
        <button className="btn btn-warning bi bi-search"></button>
      </div>
    </nav>
  </div>
);

}