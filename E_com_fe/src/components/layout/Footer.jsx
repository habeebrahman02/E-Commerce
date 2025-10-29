import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./css/Footer.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand / About */}
          <div className="col-md-3 mb-4">
              <span className="h4">G</span>
              <span className="h6">ENT</span>
              <span className="h4">Z</span>
            <p className="small">
              Your one-stop destination for premium men's fashion. 
              Explore shirts, trousers, hoodies, shoes, and more.
            </p>
          </div>

          {/* Our Products  */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Our Products</h6>
            <ul className="list-unstyled">
              <li>Shirts</li>
              <li>T-shirts</li>
              <li>Pants</li>
              <li>Hoodies</li>
              <li>Sneakers</li>
              <li>Shades</li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Customer Service</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Help & FAQs</a></li>
              <li><a href="#" className="footer-link">Shipping & Returns</a></li>
              <li><a href="#" className="footer-link">Order Tracking</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Follow Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="footer-social"><FaFacebookF /></a>
              <a href="#" className="footer-social"><FaInstagram /></a>
              <a href="#" className="footer-social"><FaTwitter /></a>
              <a href="#" className="footer-social"><FaYoutube /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center border-top border-secondary pt-3 small">
        © {new Date().getFullYear()} Amaterra. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;