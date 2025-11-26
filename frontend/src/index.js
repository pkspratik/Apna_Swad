
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "bootstrap-icons/font/bootstrap-icons.css";


// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./Components/App/App";

// import { BrowserRouter } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App/App";
import { BrowserRouter } from "react-router-dom";

//Import AuthProvider
import { AuthProvider } from "./context/AuthContext/AuthContext";

// 🔥 Add Title
document.title = "Apna Swad";

// 🔥 Add Favicon
const favicon = document.querySelector("link[rel~='icon']");
if (favicon) {
  favicon.href = "/apnaSwad.png"; // place icon inside public/apnaSwad.png
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
