"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { useState, useRef } from "react";
import { FaChevronUp, FaChevronDown, FaPlus, FaTrash } from "react-icons/fa";
import LinkWithIconButton from "@/app/components/button/LinkWithIconButton";
import styles from "./TripOpeningsForm.module.css"; // Adjust this path as needed

const TripOpeningsForm = () => {
  const { register, control, formState: { errors },watch } = useFormContext(); // Access the form context
  const { fields: tripOpeningsFields, append: appendTripOpening, remove: removeTripOpening } = useFieldArray({
    control,
    name: "trip_openings",
  });
  const watchLimitAvailability = watch("limit_availability"); // Watch checkbox status

  const [openingsDropdownOpen, setOpeningsDropdownOpen] = useState(
    Array(tripOpeningsFields.length).fill(false)
  ); // Toggle for each trip opening dropdown
  const openingRefs = useRef<(HTMLDivElement | null)[]>([]); // Store refs for each opening

  // Function to toggle the dropdown of a specific trip opening
  const toggleOpeningDropdown = (index: number) => {
    setOpeningsDropdownOpen((prev) => {
      const updatedOpenState = [...prev];
      updatedOpenState[index] = !updatedOpenState[index]; // Toggle the specific dropdown

      if (!updatedOpenState[index]) return updatedOpenState; // Don't scroll when closing

      // Scroll the opening into view when it is opened
      const openingElement = openingRefs.current[index];
      if (openingElement) {
        openingElement.scrollIntoView({
          behavior: "smooth", // Smooth scrolling
          block: "center", // Center the item in the viewport
        });

        setTimeout(() => {
          window.scrollBy({
            top: 100, // Scroll down an additional 100 pixels
            behavior: "smooth",
          });
        }, 300); // Delay to ensure the initial scrollIntoView happens first
      }

      return updatedOpenState;
    });
  };

  return (
    <div className={styles.sectionBig}>
      <h2 className="section-title">Trip Openings</h2>
      {tripOpeningsFields.map((opening, index) => (
        <div
          key={opening.id}
          className={styles.formGroup}
          ref={(el) => (openingRefs.current[index] = el)} // Attach the ref to each trip opening container
        >
          <div className={styles.sectionTitle} onClick={() => toggleOpeningDropdown(index)}>
            <h2>
              {register(`trip_openings.${index}.trip_opening_start_date`).value || `Trip Opening ${index + 1}`}
            </h2>
            <h2 className={styles.itemDropdown}>
              <span className={styles.dropdownIcon}>
                {openingsDropdownOpen[index] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </h2>
          </div>

          {openingsDropdownOpen[index] && (
            <div className={styles.dynamicSection}>
              <label className={styles.formLabel}>Start Date</label>
              <input
                className={styles.formInput}
                type="date"
                {...register(`trip_openings.${index}.trip_opening_start_date`, { required: "Start date is required" })}
              />
              {errors?.trip_openings?.[index]?.trip_opening_start_date && (
                <p className={styles.error}>{errors.trip_openings[index].trip_opening_start_date.message}</p>
              )}

              <label className={styles.formLabel}>End Date</label>
              <input
                className={styles.formInput}
                type="date"
                {...register(`trip_openings.${index}.trip_opening_end_date`, { required: "End date is required" })}
              />
              {errors?.trip_openings?.[index]?.trip_opening_end_date && (
                <p className={styles.error}>{errors.trip_openings[index].trip_opening_end_date.message}</p>
              )}

              <label className={styles.formLabel}>Price</label>
              <input
                className={styles.formInput}
                type="number"
                step="0.01"
                {...register(`trip_openings.${index}.trip_opening_price`, { required: "Price is required" })}
              />
              {errors?.trip_openings?.[index]?.trip_opening_price && (
                <p className={styles.error}>{errors.trip_openings[index].trip_opening_price.message}</p>
              )}

              <label className={styles.formLabel}>Total Availability</label>
              <input
                className={styles.formInput}
                type="number"
                {...register(`trip_openings.${index}.trip_opening_total_availability`, { required: "Availability is required" })}
              />
              {errors?.trip_openings?.[index]?.trip_opening_total_availability && (
                <p className={styles.error}>{errors.trip_openings[index].trip_opening_total_availability.message}</p>
              )}

              <label className={styles.formLabel}>Total Bookings</label>
              <input
                className={styles.formInput}
                type="number"
                {...register(`trip_openings.${index}.trip_opening_total_booking`)}
              />

              <label className={styles.formLabel}>Reward</label>
              <input
                className={styles.formInput}
                type="number"
                step="0.01"
                {...register(`trip_openings.${index}.trip_opening_total_reward`)}
              />
                
              {/* Checkbox for limiting availability */}
              <div className={styles.availabilityContainer}>
              <div className={styles.availabilityCheckbox}>
                <input
                  type="checkbox"
                  id={`limit_availability_${index}`}
                  {...register(`trip_openings.${index}.is_limited_availability`)}
                  className={styles.checkbox}
                />
                <label htmlFor={`limit_availability_${index}`} className={styles.checkboxLabel}>Limit Availability?</label>
              </div>

              {/* Conditionally render the availability field */}
              {watch(`trip_openings.${index}.limit_availability`) && (
                <div className={styles.availabilityField}>
                  <label className={styles.formLabel}>Total Availability</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    {...register(`trip_openings.${index}.trip_opening_total_availability`, {
                      required: "Availability is required",
                    })}
                  />
                  {errors?.trip_openings?.[index]?.trip_opening_total_availability && (
                    <p className={styles.error}>
                      {errors.trip_openings[index].trip_opening_total_availability.message}
                    </p>
                  )}
                </div>
              )}
            </div>
                          

              {/* Delete Button */}
              <LinkWithIconButton
                label="Delete"
                icon={<FaTrash />}
                variant="delete"
                onClick={() => {
                  removeTripOpening(index); // Remove the opening by index
                  setOpeningsDropdownOpen((prev) => prev.filter((_, i) => i !== index)); // Remove dropdown state for deleted opening
                }}
              />
            </div>
          )}
        </div>
      ))}
      <LinkWithIconButton
        label="Add Trip Opening"
        icon={<FaPlus />} // Adding the plus icon before the label
        variant="success"
        onClick={() => {
          appendTripOpening({
            trip_opening_start_date: '',
            trip_opening_end_date: '',
            trip_opening_total_reward: 0,
            is_limited_availability: false,
            trip_opening_total_availability: 0,
            trip_opening_total_booking: 0,
            trip_opening_price: 0,
          });
          setOpeningsDropdownOpen((prev) => [...prev, false]); // Add new entry for the new opening, default to closed
        }}
      />
    </div>
  );
};

export default TripOpeningsForm;
