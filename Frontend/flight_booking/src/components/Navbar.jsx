import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  FaPlane, FaUser, FaBars, FaTimes, FaHome, FaSearch, 
  FaTicketAlt, FaHotel, FaConciergeBell, FaBell, FaGlobeAmericas,
  FaGoogle, FaFacebook, FaApple, FaLinkedin, FaEnvelope, FaCar
} from 'react-icons/fa';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const [hasNotifications, setHasNotifications] = useState(true);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveTab(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileButton = document.querySelector(`.${styles.userProfileButton}`);
      if (profileButton && !profileButton.contains(event.target)) {
        setShowLoginOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [styles.userProfileButton]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Animation effect for menu items (pure CSS, no library needed)
  const menuItemStyle = (path) => {
    return {
      transform: activeTab === path ? 'translateY(-2px)' : 'none',
      transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
    };
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.blurOverlay}></div>
      <div className={styles.navContainer}>
        {/* Logo with animated plane */}
        <Link to="/" className={styles.logo}>
          <span className={`${styles.logoIcon} ${styles.rotatePlane}`}>
            <FaPlane />
          </span>
          <div className={styles.logoTextContainer}>
            <span className={styles.logoText}>SkyJourney</span>
            <span className={styles.premiumBadge}>PREMIUM</span>
          </div>
        </Link>

        <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes className={styles.navIcon} /> : <FaBars className={styles.navIcon} />}
        </div>

        {/* Main Navigation */}
        <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.open : ''}`}>
          <li style={menuItemStyle('/')}>
            <NavLink 
              to="/" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
              end
            >
              <span className={styles.navIcon}><FaHome /></span>
              <span>Home</span>
            </NavLink>
          </li>
          <li style={menuItemStyle('/booking')}>
            <NavLink 
              to="/booking" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
            >
              <span className={styles.navIcon}><FaPlane /></span>
              <span>Flights</span>
            </NavLink>
          </li>
          <li style={menuItemStyle('/hotels')}>
            <NavLink 
              to="/hotels" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
            >
              <span className={styles.navIcon}><FaHotel /></span>
              <span>Hotels</span>
              <span className={styles.newFeature}>NEW</span>
            </NavLink>
          </li>
          <li style={menuItemStyle('/car-hire')}>
            <NavLink 
              to="/car-hire" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
            >
              <span className={styles.navIcon}>
                <FaCar />
              </span>
              <span>Car</span>
              <span className={styles.luxuryBadge}>Best</span>
            </NavLink>
          </li>
          <li style={menuItemStyle('/concierge')}>
            <NavLink 
              to="/concierge" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
            >
              <span className={styles.navIcon}>
                <FaConciergeBell /> {/* Note the capital 'B' */}
              </span>
              <span>Concierge</span>
              <span className={styles.eliteBadge}>ELITE</span>
            </NavLink>
          </li>
          <li style={menuItemStyle('/my-bookings')}>
            <NavLink 
              to="/my-bookings" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
            >
              <span className={styles.navIcon}><FaTicketAlt /></span>
              <span>My Bookings</span>
            </NavLink>
          </li>
        </ul>

        {/* Action Items (right side) */}
        <div className={`${styles.navActions} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.localeSelector}>
            <FaGlobeAmericas className={styles.globeIcon} />
            <select className={styles.localeDropdown}>
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
              <option value="de">DE</option>
            </select>
          </div>
          
          <button className={styles.searchButton}>
            <FaSearch className={styles.navIcon} />
          </button>
          
          <div className={styles.notificationButton}>
            <FaBell className={styles.navIcon} />
            {hasNotifications && <span className={styles.notificationDot}></span>}
          </div>
          
          <div className={styles.userProfileButton}>
            <div className={styles.userAvatarSection} onClick={() => setShowLoginOptions(!showLoginOptions)}>
              <div className={styles.userAvatar}>
                <FaUser />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.welcomeText}>Welcome</span>
                <span className={styles.loginText}>Sign In</span>
              </div>
            </div>
            
            {showLoginOptions && (
              <div className={styles.loginOptionsDropdown}>
                <div className={styles.loginDropdownHeader}>
                  <h3>Sign in to SkyJourney</h3>
                  <p>Access your premium travel experience</p>
                </div>
                
                <div className={styles.socialLoginOptions}>
                  <button 
                    className={styles.socialLoginButton}
                    onClick={() => {
                      // Simulate OAuth popup window
                      const width = 500;
                      const height = 600;
                      const left = window.screen.width/2 - width/2;
                      const top = window.screen.height/2 - height/2;
                      window.open(
                        "https://accounts.google.com/o/oauth2/auth", 
                        "GoogleLogin", 
                        `width=${width},height=${height},left=${left},top=${top}`
                      );
                    }}
                  >
                    <FaGoogle />
                    <span>Continue with Google</span>
                  </button>
                  
                  <button 
                    className={styles.socialLoginButton}
                    onClick={() => {
                      const width = 500;
                      const height = 600;
                      const left = window.screen.width/2 - width/2;
                      const top = window.screen.height/2 - height/2;
                      window.open(
                        "https://www.facebook.com/dialog/oauth", 
                        "FacebookLogin", 
                        `width=${width},height=${height},left=${left},top=${top}`
                      );
                    }}
                  >
                    <FaFacebook />
                    <span>Continue with Facebook</span>
                  </button>
                  
                  <button 
                    className={styles.socialLoginButton}
                    onClick={() => {
                      const width = 500;
                      const height = 600;
                      const left = window.screen.width/2 - width/2;
                      const top = window.screen.height/2 - height/2;
                      window.open(
                        "https://appleid.apple.com/auth/authorize", 
                        "AppleLogin", 
                        `width=${width},height=${height},left=${left},top=${top}`
                      );
                    }}
                  >
                    <FaApple />
                    <span>Continue with Apple</span>
                  </button>
                  
                  <button 
                    className={styles.socialLoginButton}
                    onClick={() => {
                      const width = 500;
                      const height = 600;
                      const left = window.screen.width/2 - width/2;
                      const top = window.screen.height/2 - height/2;
                      window.open(
                        "https://www.linkedin.com/oauth/v2/authorization", 
                        "LinkedInLogin", 
                        `width=${width},height=${height},left=${left},top=${top}`
                      );
                    }}
                  >
                    <FaLinkedin />
                    <span>Continue with LinkedIn</span>
                  </button>
                </div>

                <div className={styles.loginDivider}>
                  <span>or</span>
                </div>
                
                <Link to="/login" className={styles.emailLoginButton}>
                  <FaEnvelope />
                  <span>Sign in with Email</span>
                </Link>
                
                <div className={styles.loginFooter}>
                  <p>New to SkyJourney?</p>
                  <Link to="/signup" className={styles.createAccountButton}>
                    <span>Create Account</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.arrowIcon}>
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;