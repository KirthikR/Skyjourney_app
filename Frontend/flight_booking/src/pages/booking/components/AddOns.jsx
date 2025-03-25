import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddOns.module.css';
import { FaSuitcase, FaUtensils, FaCouch, FaPlane, FaShoppingCart } from 'react-icons/fa';

export default function Addons() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  
  const addonCategories = [
    {
      id: 'baggage',
      title: 'Extra Baggage',
      icon: <FaSuitcase />,
      items: [
        { id: 'bag-1', name: 'Additional 5kg', price: 25, description: 'Add 5kg to your baggage allowance' },
        { id: 'bag-2', name: 'Additional 10kg', price: 45, description: 'Add 10kg to your baggage allowance' },
        { id: 'bag-3', name: 'Sports Equipment', price: 60, description: 'Transport your sports equipment safely' }
      ]
    },
    {
      id: 'meals',
      title: 'In-flight Meals',
      icon: <FaUtensils />,
      items: [
        { id: 'meal-1', name: 'Premium Meal', price: 15, description: 'Gourmet meal with beverage' },
        { id: 'meal-2', name: 'Vegetarian Option', price: 12, description: 'Fresh vegetarian meal' },
        { id: 'meal-3', name: 'Kids Meal', price: 8, description: 'Fun and nutritious meal for children' }
      ]
    },
    {
      id: 'seating',
      title: 'Seat Selection',
      icon: <FaCouch />,
      items: [
        { id: 'seat-1', name: 'Extra Legroom', price: 35, description: 'Seats with additional legroom' },
        { id: 'seat-2', name: 'Window Seat', price: 10, description: 'Guarantee a window seat' },
        { id: 'seat-3', name: 'Priority Boarding', price: 15, description: 'Board the plane first' }
      ]
    }
  ];
  
  const addToCart = (item) => {
    setCart([...cart, item]);
    setAddedToCart({...addedToCart, [item.id]: true});
    
    // Show added confirmation briefly
    setTimeout(() => {
      setAddedToCart({...addedToCart, [item.id]: false});
    }, 2000);
  };
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };
  
  const handleCheckout = () => {
    // In a real application, you would save this data and proceed to checkout
    alert(`Proceeding to checkout with ${cart.length} add-ons totaling $${getTotalPrice()}`);
    navigate('/booking/details', { state: { addons: cart } });
  };
  
  return (
    <div className={styles.addonsContainer}>
      <div className={styles.header}>
        <h1>Travel Add-ons</h1>
        <p>Enhance your journey with these optional services</p>
      </div>
      
      {addonCategories.map(category => (
        <div key={category.id} className={styles.category}>
          <div className={styles.categoryHeader}>
            <div className={styles.categoryIcon}>{category.icon}</div>
            <h2>{category.title}</h2>
          </div>
          
          <div className={styles.addonList}>
            {category.items.map(item => (
              <div key={item.id} className={styles.addonCard}>
                <div className={styles.addonInfo}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className={styles.price}>${item.price}</div>
                </div>
                <button 
                  className={`${styles.addButton} ${addedToCart[item.id] ? styles.added : ''}`}
                  onClick={() => addToCart(item)}
                  disabled={addedToCart[item.id]}
                >
                  {addedToCart[item.id] ? 'Added ✓' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {cart.length > 0 && (
        <div className={styles.cartSummary}>
          <div className={styles.cartHeader}>
            <FaShoppingCart className={styles.cartIcon} />
            <h3>Your Selected Add-ons</h3>
          </div>
          
          <ul className={styles.cartItems}>
            {cart.map((item, index) => (
              <li key={index} className={styles.cartItem}>
                <span>{item.name}</span>
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
          
          <div className={styles.cartTotal}>
            <span>Total:</span>
            <span>${getTotalPrice()}</span>
          </div>
          
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}