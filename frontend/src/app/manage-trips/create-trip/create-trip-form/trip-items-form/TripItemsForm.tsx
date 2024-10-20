'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { FaChevronUp, FaChevronDown, FaTrash } from 'react-icons/fa';
import styles from './TripItemsForm.module.css';

const TripItemsForm = () => {
  const { register, control } = useFormContext(); // Access the form context
  const { fields: activityItemsFields, append: appendActivityItem, remove: removeActivityItem } = useFieldArray({
    control,
    name: 'activity_items',
  });

  const [itemsDropdownOpen, setItemsDropdownOpen] = useState(Array(activityItemsFields.length).fill(false)); // Toggle for each trip item dropdown

  // Function to toggle the dropdown of a specific trip item
  const toggleItemDropdown = (index: number) => {
    setItemsDropdownOpen((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <div className={styles.sectionBig}>
      <button
        type="button"
        className={styles.addButton}
        onClick={() =>
          appendActivityItem({
            trip_item_name: '',
            trip_item_category: '',
            trip_item_type: '',
            trip_item_address: '',
            trip_item_traveler_reward: '',
            trip_item_price: '',
          })
        }
      >
        Add Trip Item
      </button>

      {activityItemsFields.map((item, index) => (
        <div key={item.id} className={styles.formGroup}>
          <div className={styles.sectionTitle}>
            <h2>
              {register(`activity_items.${index}.trip_item_name`).value || `Trip Item ${index + 1}`}
            </h2>
            <h2
              onClick={() => toggleItemDropdown(index)}
              className={styles.itemDropdown}
            >
              <span className={styles.dropdownIcon}>
                {itemsDropdownOpen[index] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </h2>
          </div>

          {itemsDropdownOpen[index] && (
            <div className={styles.dynamicSection}>
              <label className={styles.formLabel}>Trip Item Name</label>
              <input
                className={styles.formInput}
                {...register(`activity_items.${index}.trip_item_name`, { required: true })}
              />

              <label className={styles.formLabel}>Trip Item Category</label>
              <input
                className={styles.formInput}
                {...register(`activity_items.${index}.trip_item_category`, { required: true })}
              />

              <label className={styles.formLabel}>Trip Item Type</label>
              <input
                className={styles.formInput}
                {...register(`activity_items.${index}.trip_item_type`, { required: true })}
              />

              <label className={styles.formLabel}>Trip Item Address</label>
              <input
                className={styles.formInput}
                {...register(`activity_items.${index}.trip_item_address`)}
              />

              <label className={styles.formLabel}>Traveler Reward</label>
              <input
                type="number"
                className={styles.formInput}
                {...register(`activity_items.${index}.trip_item_traveler_reward`)}
              />

              <label className={styles.formLabel}>Trip Item Price</label>
              <input
                type="number"
                step="0.01"
                className={styles.formInput}
                {...register(`activity_items.${index}.trip_item_price`)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TripItemsForm;
