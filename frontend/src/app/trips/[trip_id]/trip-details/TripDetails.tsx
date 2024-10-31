import React from 'react';
import { FaMapMarkerAlt, FaStar, FaCalendarAlt, FaMoneyBillAlt } from 'react-icons/fa';
import styles from './TripDetails.module.css';

const TripDetails = ({ trip }) => {
  return (
    <div className={styles.tripDetailsContainer}>
      {/* Trip Main Info */}
      <div className={styles.mainInfo}>
        <img src={trip.trip_image_url} alt={trip.trip_title} className={styles.mainImage} />
        <div className={styles.infoContent}>
          <h1 className={styles.title}>{trip.trip_title}</h1>
          <p className={styles.description}>{trip.trip_description}</p>
          <div className={styles.location}>
            <FaMapMarkerAlt /> <span>{trip.trip_origin} - {trip.trip_destination}</span>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className={styles.detailsGrid}>
        {/* Base Price */}
        <div className={styles.detailItem}>
          <FaMoneyBillAlt className={styles.icon} />
          <span>Base Price: ${trip.trip_base_price}</span>
        </div>

        {/* Trip Rewards */}
        <div className={styles.detailItem}>
          <FaMoneyBillAlt className={styles.icon} />
          <span>Reward: ${trip.trip_base_reward}</span>
        </div>

        {/* Upvotes and Downvotes */}
        <div className={styles.votes}>
          <span>👍 {trip.trip_upvote}</span> <span>👎 {trip.trip_downvote}</span>
        </div>

        {/* Trip Opening Details */}
        <div className={styles.opening}>
          <FaCalendarAlt className={styles.icon} />
          <span>Available from {trip.trip_opening_start_date} to {trip.trip_opening_end_date}</span>
        </div>
      </div>

      {/* Trip Items */}
      <div className={styles.itemsSection}>
        <h2>Included Trip Items</h2>
        <ul>
          {trip.trip_items.map(item => (
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
          ))}
        </ul>
      </div>

      {/* Trip Ratings */}
      <div className={styles.ratingsSection}>
        <h2>User Ratings & Reviews</h2>
        {trip.trip_ratings.map(rating => (
          <div key={rating.trip_rating_id} className={styles.ratingItem}>
            <FaStar className={styles.ratingIcon} />
            <span>{rating.trip_rating_score}/5</span>
            <p>{rating.trip_rating_review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetails;
