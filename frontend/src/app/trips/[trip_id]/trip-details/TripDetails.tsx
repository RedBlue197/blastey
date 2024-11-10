"use client"; // Ensures this component is treated as a client component
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaStar, FaCalendarAlt, FaMoneyBillAlt, FaWhatsapp } from 'react-icons/fa';
import styles from './TripDetails.module.css';

const TripDetails = ({ trip }) => {
  const [selectedImage, setSelectedImage] = useState(trip?.trip_images[0]?.trip_image_url || 'https://picsum.photos/2400/300');

  if (!trip) return <div>No trip details available.</div>;

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className={styles.tripDetailsContainer}>
      <div className={styles.mainInfo}>
        <img
          src={selectedImage}
          alt={`${trip.trip_title || 'Trip'}'s picture`}
          className={styles.picture}
        />
        <div className={styles.infoContent}>
          <h1 className={styles.title}>{trip.trip_title || 'Trip Title'}</h1>
          <p className={styles.description}>{trip.trip_description || 'No description available.'}</p>
          <div className={styles.location}>
            <FaMapMarkerAlt /> <span>{trip.trip_origin || 'Origin'} - {trip.trip_destination || 'Destination'}</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <FaMoneyBillAlt className={styles.icon} />
          <span>Base Price: ${trip.trip_openings.length > 0 ? trip.trip_openings[0].trip_opening_price : 'N/A'}</span>
        </div>

        <div className={styles.detailItem}>
          <FaMoneyBillAlt className={styles.icon} />
          <span>Reward: ${trip.trip_openings.length > 0 ? trip.trip_openings[0].trip_opening_total_reward || 'N/A' : 'N/A'}</span>
        </div>

        <div className={styles.votes}>
          <span>👍 {trip.trip_upvote || 0}</span> <span>👎 {trip.trip_downvote || 0}</span>
        </div>

        {trip.trip_openings.length > 0 && (
          <div className={styles.opening}>
            <FaCalendarAlt className={styles.icon} />
            <span>
              Available from {trip.trip_openings[0].trip_opening_start_date.toString() || 'Start Date'} to {trip.trip_openings[0].trip_opening_end_date.toString() || 'End Date'}
            </span>
          </div>
        )}
      </div>

      <div className={styles.itemsSection}>
        <h2>Included Trip Items</h2>
        <ul>
          {trip.trip_items.length > 0 ? (
            trip.trip_items.map((item) => (
              <li key={item.trip_item_id} className={styles.tripItem}>
                <img src={item.trip_item_image || 'https://picsum.photos/100'} alt={item.trip_item_name} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <h3>{item.trip_item_name}</h3>
                  <p>{item.trip_item_description || 'No description provided.'}</p>
                  <span>Category: {item.trip_item_category}</span>
                  <span>Type: {item.trip_item_type}</span>
                  <span>Price: ${item.trip_item_price || 'N/A'}</span>
                </div>
              </li>
            ))
          ) : (
            <p>No items included in this trip.</p>
          )}
        </ul>
      </div>

      <div className={styles.ratingsSection}>
        <h2>User Ratings & Reviews</h2>
        {trip.trip_ratings.length > 0 ? (
          trip.trip_ratings.map((rating) => (
            <div key={rating.trip_rating_id} className={styles.ratingItem}>
              <FaStar className={styles.ratingIcon} />
              <span>{rating.trip_rating_score}/5</span>
              <p>{rating.trip_rating_review || 'No review provided.'}</p>
            </div>
          ))
        ) : (
          <p>No ratings available.</p>
        )}
      </div>

      {/* Trip Openings Section */}
      <div className={styles.openingsSection}>
        <h2>Available Trip Openings</h2>
        <ul>
          {trip.trip_openings.length > 0 ? (
            trip.trip_openings.map((opening) => (
              <li key={opening.trip_opening_id} className={styles.openingItem}>
                <h3>{opening.trip_opening_title}</h3>
                <p>{opening.trip_opening_description || 'No description available.'}</p>
                <span>From {opening.trip_opening_start_date} to {opening.trip_opening_end_date}</span>
                <span>Price: ${opening.trip_opening_price || 'N/A'}</span>
              </li>
            ))
          ) : (
            <p>No available openings for this trip.</p>
          )}
        </ul>
      </div>

      {/* Image Gallery Section */}
      <div className={styles.gallerySection}>
        <h2>Image Gallery</h2>
        <div className={styles.gallery}>
          {trip.trip_images.map((image, index) => (
            <img
              key={index}
              src={image.trip_image_url}
              alt={`Gallery image ${index + 1}`}
              className={styles.galleryImage}
              onClick={() => handleImageSelect(image.trip_image_url)}
            />
          ))}
        </div>
      </div>

      {/* Contact Buttons */}
      <div className={styles.contactButtons}>
        <a href={`https://wa.me/<YOUR_WHATSAPP_NUMBER>?text=Hi, I'm interested in ${trip.trip_title}`} className={styles.contactButton}>
          <FaWhatsapp /> Contact on WhatsApp
        </a>
        <button className={styles.orderButton}>Order Now</button>
      </div>
    </div>
  );
};

export default TripDetails;
