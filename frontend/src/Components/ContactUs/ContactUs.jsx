import React, { useState } from "react";
import "./ContactUs.css";
import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";
import emailjs from "emailjs-com";

export function ContactUs() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter a valid email";
    if (!form.message.trim()) return "Please enter your message";
    return "";
  };

  const handleSend = (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError("");

    const emailData = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
      attachment: file,
    };

    emailjs
      .send(
        "service_v91wswc",
        "template_7f5f5fj",
        emailData,
        "fOQT0RAPDU5aJz4yz"
      )
      .then(() => {
        alert("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
        setFile(null);
      })
      .catch((err) => {
        alert("Failed to send message.");
        console.log(err);
      });
  };

  return (
    <div>
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <div className="contact-main">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          We’d love to hear from you! Reach out for orders, feedback or support.
        </p>

        <div className="contact-card">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <p className="info-detail">📍 Apna Swad Restaurant, Bihar, India</p>
            <p className="info-detail">📞 +91 7221976207</p>
            <p className="info-detail">📧 apnaswad99@gmail.com</p>

            <div className="social-icons">
              <a
                href="https://www.facebook.com/profile.php?id=61584128935062"
                target="_blank"
              >
                <i className="bi bi-facebook"></i>
              </a>

              <a href="https://www.instagram.com/apnaswad99/" target="_blank">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="https://twitter.com/apnaswad" target="_blank">
                <i className="bi bi-twitter"></i>
              </a>

              <a
                href="https://wa.me/917221976207?text=Hello%20Apna%20Swad!"
                target="_blank"
              >
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Form */}
          <form className="contact-form" onSubmit={handleSend}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="input-group">
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
              <label>Your Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
              <label>Email Address</label>
            </div>

            <div className="input-group">
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                required
              ></textarea>
              <label>Your Message</label>
            </div>

            {/* File Upload */}
            <div className="input-group">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label>Attach File (optional)</label>
            </div>

            <button className="contact-btn">Send Message</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
