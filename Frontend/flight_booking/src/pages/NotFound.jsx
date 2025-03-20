import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className={styles.homeButton}>
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}