// // import React from "react";
// // import "./Footer.css";
// // import { Link } from "react-router-dom";

// // export function Footer() {
// //   return (
// //     <footer
// //       className="mt-5 pt-5 pb-3"
// //       style={{
// //         backgroundColor: "rgba(255, 255, 255, 0.05)",
// //         backdropFilter: "blur(10px)",
// //         border: "1px solid rgba(255, 255, 255, 0.2)",
// //         borderRadius: "15px",
// //         boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
// //         transition: "all 0.3s ease",
// //       }}
// //     >
// //       <div className="container footer-container">

// //         {/* Top Row */}
// //         <div className="row align-items-center border-bottom pb-4 mb-4 border-secondary text-center text-md-start">

// //           {/* Col 1 */}

// //           <div className="col-md-4 mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start footer-contact">
// //           <Link to="/contactUs">
// //             <button className="btn px-4 py-2 rounded border-0 footer-contact-button">
// //           📩 Contact us
// //          </button>
// //          </Link>
// //          </div>

// //           {/* Col 2 */}
// //           <div className="col-md-4 mb-3 mb-md-0">
// //             <p className="mb-0 small footer-small-text">
// //               Shamkuriya bazar near by Railway Station ,saran ,Bihar
// //             </p>
// //           </div>

// //           {/* Col 3 */}
// //          <div className="col-md-4 text-center text-md-end">
// //           <Link to="/category">
// //             <button className="btn text-white fw-semibold px-4 py-2 rounded footer-button">
// //            Get started Order now!
// //          </button>
// //          </Link>
// //          </div>

// //         </div>

// //         {/* Footer Links */}
// //         <div className="row gy-4 text-light">
// //           {[
// //             { title: "Category", items: ["Veg", "Non-Veg", "Soft Drink"] },
// //             { title: "Order", items: ["Online", "Ofline", "Home Delivery"] },
// //             { title: "For Order", items: ["Websit", "Application", "Within 25 Minutes"] },
// //             { title: "Address", items: ["Shamkuriya Bazar", "Near by Railway Station"] },
// //             { title: "COMPANY", items: ["About Us", "Careers", "Privacy Policy"] },
// //             { title: "FOLLOW US", items: ["Facebook", "Instagram", "YouTube"] },
// //           ].map((section, i) => (
// //             <div key={i} className="col-6 col-sm-4 col-md-2">
// //               <h6 className="footer-title mb-3">{section.title}</h6>
// //               <ul className="list-unstyled small">
// //                 {section.items.map((item, j) => (
// //                   <li key={j}>
// //                     <a href="/" className="footer-link">{item}</a>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Bottom Row */}
// //         <div className="border-top border-secondary mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center footer-bottom-text">

// //           <div className="d-flex align-items-center gap-2 mb-2 mb-sm-0">
// //             <div
// //               className="fw-bold rounded-circle d-flex align-items-center justify-content-center"
// //               style={{
// //                 width: "100px",
// //                 height: "30px",
// //                 backgroundColor: "#00B386",
// //                 color: "#4d4c4cff",
// //                 boxShadow: "0 0 8px rgba(0, 179, 134, 0.8)",
// //               }}
// //             >
// //               Apna Swad
// //             </div>
// //             <span>© 2025</span>
// //           </div>

// //           <span>Made with ❤️ by Apna Swad</span>
// //         </div>
// //       </div>
// //     </footer>
// //   );
// // }





// afer add dark and light mode

import React, { useState, useEffect } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export function Footer() {
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState("light");

  // Load theme from storage
  useEffect(() => {
    const saved = localStorage.getItem("footerTheme");
    if (saved) setTheme(saved);
  }, []);

  // Update localStorage and HTML class
  useEffect(() => {
    document.body.dataset.footerTheme = theme;
    localStorage.setItem("footerTheme", theme);
  }, [theme]);

  return (
    <footer
      className="footer-wrapper"
      style={{

        backdropFilter: expanded ? "blur(12px)" : "none",
        transition: "0.4s ease",
      }}
    >
      {/* Background overlay for blur effect */}
      {expanded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(5px)",
            zIndex: 40,
          }}
          onClick={() => setExpanded(false)}
        ></div>
      )}

      <div
        className="container footer-container"
        style={{
          backgroundColor:
            theme === "light"
              ? "rgba(255,255,255,0.10)"
              : "rgba(0,0,0,0.40)",
          borderRadius: "15px 15px 0 0",
          backdropFilter: "blur(20px)",
          paddingTop: "15px",
          paddingBottom: "10px",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 -4px 15px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 100,
          transition: "0.4s ease",
        }}
      >
        {/* Top Bar Always Visible */}
        <div className="row align-items-center pb-3 text-center text-md-start">
          <div className="col-md-4 mb-3 d-flex justify-content-center justify-content-md-start">
            <Link to="/contactUs">
              <button className="btn btn-light px-4 py-2 rounded">
                📩 Contact us
              </button>
            </Link>
          </div>

          <div className="col-md-4 mb-3">
            <p className="mb-0 small">
              Shamkuriya bazar near Railway Station, Saran, Bihar
            </p>
          </div>

          <div className="col-md-4 text-center text-md-end">
            <Link to="/category">
              <button className="btn btn-success fw-semibold px-4 py-2 rounded">
                Get started Order now!
              </button>
            </Link>
          </div>
        </div>

        {/* Toggle Arrow */}
        <div className="text-center mb-2">
          <button
            className="btn btn-light"
            style={{
              borderRadius: "50%",
              width: "42px",
              height: "42px",
              fontSize: "22px",
              boxShadow: "0 0 8px rgba(255,255,255,0.5)",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "⬆" : "⬇"}
          </button>
        </div>

        {/* Slide Animation Wrapper */}
        <div
          style={{
            maxHeight: expanded ? "1000px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.6s ease",
          }}
        >
          {/* Footer Links */}
          <div className="row gy-4 text-light mt-3">
            {[
              { title: "CATEGORY", items: ["Veg", "Non-Veg", "Soft Drink"] },
              { title: "ORDER", items: ["Online", "Offline", "Home Delivery"] },
              { title: "FOR ORDER", items: ["Website", "Application", "25 Minutes"] },
              { title: "ADDRESS", items: ["Shamkuriya Bazar", "Near Railway Station"] },
              { title: "COMPANY", items: ["About Us", "Careers", "Privacy Policy"] },
              { title: "FOLLOW US", items: ["Facebook", "Instagram", "YouTube"] },
            ].map((section, i) => (
              <div key={i} className="col-6 col-sm-4 col-md-2">
                <h6 className="footer-title mb-3">{section.title}</h6>
                <ul className="list-unstyled small">
                  {section.items.map((item, j) => (
                    <li key={j}>
                      <a href="/" className="footer-link">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-top mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 mb-2">
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

            {/* Dark / Light Mode Toggle */}
            <button
              className="btn btn-outline-light ms-3"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀ Light Mode"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
