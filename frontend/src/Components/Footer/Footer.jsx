import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer
      className="mt-5 pt-5 pb-3"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container footer-container">
        
        {/* Top Row */}
        <div className="row align-items-center border-bottom pb-4 mb-4 border-secondary text-center text-md-start">
          
          {/* Col 1 */}
         
          <div className="col-md-4 mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start footer-contact">
          <Link to="/contactUs">
            <button className="btn px-4 py-2 rounded border-0 footer-contact-button">
          📩 Contact us
         </button>
         </Link>
         </div>

          {/* Col 2 */}
          <div className="col-md-4 mb-3 mb-md-0">
            <p className="mb-0 small footer-small-text">
              Shamkuriya bazar near by Railway Station ,saran ,Bihar
            </p>
          </div>

          {/* Col 3 */}
         <div className="col-md-4 text-center text-md-end">
          <Link to="/category">
            <button className="btn text-white fw-semibold px-4 py-2 rounded footer-button">
           Get started Order now!
         </button>
         </Link>
         </div>

        </div>

        {/* Footer Links */}
        <div className="row gy-4 text-light">
          {[
            { title: "Category", items: ["Veg", "Non-Veg", "Soft Drink"] },
            { title: "Order", items: ["Online", "Ofline", "Home Delivery"] },
            { title: "For Order", items: ["Websit", "Application", "Within 25 Minutes"] },
            { title: "Address", items: ["Shamkuriya Bazar", "Near by Railway Station"] },
            { title: "COMPANY", items: ["About Us", "Careers", "Privacy Policy"] },
            { title: "FOLLOW US", items: ["Facebook", "Instagram", "YouTube"] },
          ].map((section, i) => (
            <div key={i} className="col-6 col-sm-4 col-md-2">
              <h6 className="footer-title mb-3">{section.title}</h6>
              <ul className="list-unstyled small">
                {section.items.map((item, j) => (
                  <li key={j}>
                    <a href="/" className="footer-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="border-top border-secondary mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center footer-bottom-text">
          
          <div className="d-flex align-items-center gap-2 mb-2 mb-sm-0">
            <div
              className="fw-bold rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "100px",
                height: "30px",
                backgroundColor: "#00B386",
                color: "#4d4c4cff",
                boxShadow: "0 0 8px rgba(0, 179, 134, 0.8)",
              }}
            >
              Apna Swad
            </div>
            <span>© 2025</span>
          </div>

          <span>Made with ❤️ by Apna Swad</span>
        </div>
      </div>
    </footer>
  );
}
