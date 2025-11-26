import React from "react";
import "./ContactUs.css";
import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";

export function ContactUs() {
  return (
    <div>
      {/* Navbar */}
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <div className="contact-main">

        {/* Header */}
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          We’d love to hear from you! Reach out for orders, feedback or support.
        </p>

        {/* Card */}
        <div className="contact-card">

          {/* Info */}
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <p className="info-detail">📍 Apna Swad Restaurant, Bihar, India</p>
            <p className="info-detail">📞 +91 7221976207</p>
            <p className="info-detail">📧 apnaswad99@gmail.com</p>


               {/* Social Icons */}
           
           <div className="social-icons">

  {/* Facebook */}
  <a
    href="https://www.facebook.com/profile.php?id=61584128935062"
    target="_blank"
    rel="noopener noreferrer"
  >
    <i className="bi bi-facebook"></i>
  </a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/apnaswad99/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <i className="bi bi-instagram"></i>
  </a>

  {/* Twitter */}
  <a
    href="https://twitter.com/apnaswad"
    target="_blank"
    rel="noopener noreferrer"
  >
    <i className="bi bi-twitter"></i>
  </a>

  {/* WhatsApp */}
  <a
    href="https://wa.me/917221976207?text=Hello%20Apna%20Swad!"
    target="_blank"
    rel="noopener noreferrer"
  >
    <i className="bi bi-whatsapp"></i>
  </a>

</div>

          </div>

          {/* Form */}
          <form className="contact-form">
            <div className="input-group">
              <input type="text" required />
              <label>Your Name</label>
            </div>

            <div className="input-group">
              <input type="email" required />
              <label>Email Address</label>
            </div>

            <div className="input-group">
              <textarea required></textarea>
              <label>Your Message</label>
            </div>

            <button className="contact-btn">Send Message</button>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
}
