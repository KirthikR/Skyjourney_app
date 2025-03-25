import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaCreditCard, FaArrowRight } from 'react-icons/fa';
import styles from './Hotel.module.css';

const HotelBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: 'standard',
    specialRequests: '',
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Mock hotel data - in a real app, you'd fetch this from an API
  const hotel = {
    id,
    name: 'Luxury Palace Hotel',
    location: 'Paris, France',
    price: 249,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    // Calculate nights
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Base price calculation
    let roomPrice = hotel.price;
    if (formData.roomType === 'deluxe') roomPrice *= 1.5;
    if (formData.roomType === 'suite') roomPrice *= 2.2;
    
    const subtotal = roomPrice * nights;
    const tax = subtotal * 0.12;
    
    return {
      subtotal,
      tax,
      total: subtotal + tax,
      nights
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    
    // In a real app, you'd submit this to your API
    // For now, just navigate to confirmation
    navigate('/hotels/confirmation', { 
      state: { 
        booking: formData, 
        hotel, 
        pricing: calculateTotal() 
      } 
    });
  };

  const { subtotal, tax, total, nights } = calculateTotal();

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.bookingHeader}>
        <h1>Complete Your Booking</h1>
        <p>You're just a few steps away from your stay at {hotel.name}</p>
      </div>

      <div className={styles.bookingContent}>
        <div className={styles.bookingForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <h3>Guest Information</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Stay Details</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="checkIn">
                    <FaCalendarAlt /> Check-in Date
                  </label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="checkOut">
                    <FaCalendarAlt /> Check-out Date
                  </label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="guests">
                    <FaUser /> Guests
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="roomType">Room Type</label>
                  <select
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    required
                  >
                    <option value="standard">Standard Room</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Luxury Suite</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="specialRequests">Special Requests</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special requests or preferences for your stay..."
                ></textarea>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Payment Information</h3>
              <div className={styles.formGroup}>
                <label>Payment Method</label>
                <div className={styles.paymentOptions}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleChange}
                    />
                    <FaCreditCard /> Credit Card
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                    />
                    PayPal
                  </label>
                </div>
              </div>
              
              {formData.paymentMethod === 'credit' && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      required
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="cardName">Name on Card</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.formRow} style={{ gap: '10px' }}>
                      <div className={styles.formGroup} style={{ flex: 2 }}>
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button type="submit" className={styles.bookNowBtn}>
              Complete Booking <FaArrowRight />
            </button>
          </form>
        </div>

        <div className={styles.bookingSummary}>
          <div className={styles.summaryCard}>
            <div className={styles.hotelPreview}>
              <img src={hotel.image} alt={hotel.name} />
              <div className={styles.hotelInfo}>
                <h3>{hotel.name}</h3>
                <p>{hotel.location}</p>
              </div>
            </div>
            
            <div className={styles.stayDetails}>
              <h4>Your Stay</h4>
              <div className={styles.detailRow}>
                <span>Check-in</span>
                <span>{formData.checkIn || 'Select date'}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Check-out</span>
                <span>{formData.checkOut || 'Select date'}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Guests</span>
                <span>{formData.guests}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Room Type</span>
                <span>
                  {formData.roomType === 'standard' && 'Standard Room'}
                  {formData.roomType === 'deluxe' && 'Deluxe Room'}
                  {formData.roomType === 'suite' && 'Luxury Suite'}
                </span>
              </div>
            </div>
            
            <div className={styles.priceSummary}>
              <h4>Price Details</h4>
              {nights > 0 && (
                <>
                  <div className={styles.priceRow}>
                    <span>Room Rate × {nights} nights</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Taxes & Fees</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className={`${styles.priceRow} ${styles.totalRow}`}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </>
              )}
              {nights === 0 && (
                <p className={styles.selectDates}>Select check-in and check-out dates to see total price.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;