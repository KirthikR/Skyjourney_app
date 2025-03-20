import React, { useState, lazy, Suspense } from 'react';
import styles from '../styles/LoadingSpinner.module.css';

const SearchResults = lazy(() => import('./pages/SearchResults'));

export default function LoadingSpinner() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!origin) errors.origin = 'Origin is required';
    if (!destination) errors.destination = 'Destination is required';
    if (!departDate) errors.departDate = 'Departure date is required';
    return errors;
  };

  // In your search function
  try {
    setIsLoading(true);
    // API call
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }

  return (
    <div className={styles.spinner}>
      <div className={styles.loader}></div>
      <p>Searching for the best flights...</p>
    </div>
  );
}

// In your router
<Suspense fallback={<LoadingSpinner />}>
  <SearchResults />
</Suspense>