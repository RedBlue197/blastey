"use client"; // Ensures this component is treated as a client component
import React from 'react';
import { FaMapMarkerAlt, FaStar, FaCalendarAlt, FaMoneyBillAlt } from 'react-icons/fa';
import styles from './TripDetails.module.css';

const TripDetails = ({ trip }) => {
  if (!trip) return <div>No trip details available.</div>;

  return (
    <div className={styles.tripDetailsContainer}>
      <div className={styles.mainInfo}>
        <img
          src={trip.trip_image_url || 'https://picsum.photos/2400/300'}
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
          <span>Base Price: ${trip.trip_base_price || 'N/A'}</span>
        </div>

        <div className={styles.detailItem}>
          <FaMoneyBillAlt className={styles.icon} />
          <span>Reward: ${trip.trip_base_reward || 'N/A'}</span>
        </div>

        <div className={styles.votes}>
          <span>👍 {trip.trip_upvote || 0}</span> <span>👎 {trip.trip_downvote || 0}</span>
        </div>

        <div className={styles.opening}>
          <FaCalendarAlt className={styles.icon} />
          <span>Available from {trip.trip_opening_start_date || 'Start Date'} to {trip.trip_opening_end_date || 'End Date'}</span>
        </div>
      </div>

      <div className={styles.itemsSection}>
        <h2>Included Trip Items</h2>
        <ul>
          {trip.trip_items?.length > 0 ? (
            trip.trip_items.map((item) => (
              <li key={item.trip_item_id} className={styles.tripItem}>
                <img src={item.trip_item_image} alt={item.trip_item_name} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <h3>{item.trip_item_name}</h3>
                  <p>{item.trip_item_description}</p>
                  <span>Category: {item.trip_item_category}</span>
                  <span>Type: {item.trip_item_type}</span>
                  <span>Price: ${item.trip_item_price}</span>
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
        {trip.trip_ratings?.length > 0 ? (
          trip.trip_ratings.map((rating) => (
            <div key={rating.trip_rating_id} className={styles.ratingItem}>
              <FaStar className={styles.ratingIcon} />
              <span>{rating.trip_rating_score}/5</span>
              <p>{rating.trip_rating_review}</p>
            </div>
          ))
        ) : (
          <p>No ratings available.</p>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
