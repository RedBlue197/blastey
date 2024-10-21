"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { useState, useRef } from 'react';
import { FaChevronUp, FaChevronDown, FaPlus, FaTrash } from 'react-icons/fa';
import LinkWithIconButton from '@/app/components/button/LinkWithIconButton';
import styles from './TripItemsForm.module.css';

const TripItemsForm = () => {
  const { register, control } = useFormContext(); // Access the form context
  const { fields: activityItemsFields, append: appendActivityItem, remove: removeActivityItem } = useFieldArray({
    control,
    name: 'activity_items',
  });

  const [itemsDropdownOpen, setItemsDropdownOpen] = useState(Array(activityItemsFields.length).fill(false)); // Toggle for each trip item dropdown
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]); // To store refs for each item

  // Function to toggle the dropdown of a specific trip item
  const toggleItemDropdown = (index: number) => {
    setItemsDropdownOpen((prev) => {
      const updatedOpenState = [...prev];
      updatedOpenState[index] = !updatedOpenState[index]; // Toggle the specific dropdown

      if (!updatedOpenState[index]) return updatedOpenState; // Don't scroll when closing the item

      // Scroll the item into view when it is opened
      const itemElement = itemRefs.current[index];
      if (itemElement) {
        itemElement.scrollIntoView({
          behavior: 'smooth', // Smooth scrolling
          block: 'center',    // Center the item in the viewport
        });

        // Additional scroll adjustment (e.g., 100px further down)
        setTimeout(() => {
          window.scrollBy({
            top: 100, // Scroll down an additional 100 pixels
            behavior: 'smooth',
          });
        }, 300); // Delay to ensure the initial scrollIntoView happens first
      }
      
      return updatedOpenState;
    });
  };

  return (
    <div className={styles.sectionBig}>
      <h2 className="section-title">Enter trip items details</h2>
      {activityItemsFields.map((item, index) => (
        <div 
          key={item.id} 
          className={styles.formGroup}
          ref={el => (itemRefs.current[index] = el)} // Attach the ref to each trip item container
        >
          <div className={styles.sectionTitle} onClick={() => toggleItemDropdown(index)}>
            <h2>
              {register(`activity_items.${index}.trip_item_name`).value || `Trip Item ${index + 1}`}
            </h2>
            <h2 className={styles.itemDropdown}>
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
              
              {/* Delete Button */}
              <LinkWithIconButton
                label="Delete"
                icon={<FaTrash />}
                variant="delete"
                onClick={() => {
                  removeActivityItem(index); // Remove the item by index
                  setItemsDropdownOpen((prev) => prev.filter((_, i) => i !== index)); // Remove dropdown state for deleted item
                }}
              />
            </div>
          )}
        </div>
      ))}
      <LinkWithIconButton
        label="Add Trip Item"
        icon={<FaPlus />}  // Adding the plus icon before the label
        variant="success"
        onClick={() => {
          appendActivityItem({
            trip_item_name: '',
            trip_item_category: '',
            trip_item_type: '',
            trip_item_address: '',
            trip_item_traveler_reward: '',
            trip_item_price: '',
          });
          setItemsDropdownOpen((prev) => [...prev, false]); // Add new entry for the new item, default to closed
        }}
      />
    </div>
  );
};

export default TripItemsForm;
