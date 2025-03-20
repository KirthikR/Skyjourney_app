import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>FLIGHT BOOKING.COM ✈️</div>
      <div className={styles.navContent}>
        <ul className={styles.navLinks}>
          <li><Link to="/">🏠 Home</Link></li>
          <li><Link to="/flights" className={styles.navLink}>✈️ Flights</Link></li>
          <li><Link to="/booking">📅 Booking</Link></li>
        </ul>
        <button 
          className={styles.loginButton}
          onClick={() => setIsLoginModalOpen(true)}
        >
          Login
        </button>
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
}
