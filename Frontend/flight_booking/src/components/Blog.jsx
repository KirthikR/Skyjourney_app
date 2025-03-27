import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Blog.module.css';

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Hidden Gems in Southeast Asia",
      excerpt: "Discover breathtaking destinations off the beaten path that most tourists miss...",
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "March 15, 2025",
      category: "Destinations"
    },
    {
      id: 2,
      title: "How to Pack for a 2-Week Trip in Just a Carry-on",
      excerpt: "Expert packing tips that will save you from checked baggage fees and lost luggage...",
      image: "https://images.unsplash.com/photo-1553531384-397c80973a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "March 10, 2025",
      category: "Travel Tips"
    },
    {
      id: 3,
      title: "Sustainable Travel: Reducing Your Carbon Footprint",
      excerpt: "Learn how to make eco-friendly choices while still enjoying amazing travel experiences...",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "March 5, 2025",
      category: "Eco-Travel"
    },
    {
      id: 4,
      title: "Budget Travel Guide: Europe on $50 a Day",
      excerpt: "Yes, it's possible! Discover how to experience the best of Europe without breaking the bank...",
      image: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "February 28, 2025",
      category: "Budget Travel"
    },
    {
      id: 5,
      title: "Airport Lounge Access: Is It Worth the Cost?",
      excerpt: "We break down the pros and cons of airport lounges and share tips for getting access for less...",
      image: "https://images.unsplash.com/photo-1576302068646-aceaedff3503?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "February 20, 2025",
      category: "Airport Tips"
    },
    {
      id: 6,
      title: "Best Travel Rewards Credit Cards of 2025",
      excerpt: "Maximize your points and miles with these top travel credit cards for every type of traveler...",
      image: "https://images.unsplash.com/photo-1601593346740-925612772716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "February 15, 2025",
      category: "Travel Hacks"
    }
  ];

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogHero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>SkyJourney Blog</h1>
          <p>Travel insights, tips, and inspiration</p>
        </div>
      </div>

      <div className={styles.blogContent}>
        <div className={styles.featuredPost}>
          <div className={styles.featuredImage}>
            <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Featured post" />
          </div>
          <div className={styles.featuredText}>
            <span className={styles.featuredLabel}>Featured Post</span>
            <h2>The Ultimate Guide to Round-the-World Tickets</h2>
            <p className={styles.postMeta}>March 25, 2025 • 12 min read</p>
            <p className={styles.postExcerpt}>Planning a multi-continent adventure? Round-the-world tickets might be your best option. We cover everything from booking strategies to itinerary planning in this comprehensive guide.</p>
            <Link to="/blog/post/round-the-world-tickets" className={styles.readMoreLink}>Read Article →</Link>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Latest Articles</h2>

        <div className={styles.blogGrid}>
          {blogPosts.map(post => (
            <div className={styles.blogCard} key={post.id}>
              <div className={styles.blogCardImage}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <span className={styles.blogCategory}>{post.category}</span>
              </div>
              <div className={styles.blogCardContent}>
                <p className={styles.blogDate}>{post.date}</p>
                <h3>{post.title}</h3>
                <p className={styles.blogExcerpt}>{post.excerpt}</p>
                <Link to={`/blog/post/${post.id}`} className={styles.readMore}>Read More →</Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.subscribeBanner}>
          <div className={styles.subscribeContent}>
            <h3>Stay Updated on Travel Tips and Deals</h3>
            <p>Subscribe to our newsletter and never miss a travel hack or flight deal again.</p>
            <form className={styles.subscribeForm}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;