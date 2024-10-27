"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { useState, useRef } from "react";
import { FaChevronUp, FaChevronDown, FaPlus, FaTrash } from "react-icons/fa";
import LinkWithIconButton from "@/app/components/button/LinkWithIconButton";
import styles from "./TripOpeningsForm.module.css";
import Checkbox from '@mui/material/Checkbox';
import { green } from '@mui/material/colors';

const TripOpeningsForm = () => {
  const { register, control, formState: { errors }, watch } = useFormContext();
  const { fields: tripOpeningsFields, append: appendTripOpening, remove: removeTripOpening } = useFieldArray({
    control,
    name: "trip_openings",
  });

  const [openingsDropdownOpen, setOpeningsDropdownOpen] = useState(
    Array(tripOpeningsFields.length).fill(false)
  );
  const openingRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleOpeningDropdown = (index) => {
    setOpeningsDropdownOpen((prev) => {
      const updatedOpenState = [...prev];
      updatedOpenState[index] = !updatedOpenState[index];
      if (!updatedOpenState[index]) return updatedOpenState;

      const openingElement = openingRefs.current[index];
      if (openingElement) {
        openingElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setTimeout(() => {
          window.scrollBy({ top: 100, behavior: "smooth" });
        }, 300);
      }

      return updatedOpenState;
    });
  };

  return (
    <div className={styles.sectionBig}>
      <h2 className="section-title">Trip Openings</h2>
      {tripOpeningsFields.map((opening, index) => {
        const isLimitedAvailability = watch(`trip_openings.${index}.is_limited_availability`);

        return (
          <div
            key={opening.id}
            className={styles.formGroup}
            ref={(el) => (openingRefs.current[index] = el)}
          >
            <div className={styles.sectionTitle} onClick={() => toggleOpeningDropdown(index)}>
              <h2>
                {watch(`trip_openings.${index}.trip_opening_start_date`) || `Trip Opening ${index + 1}`}
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
                  {...register(`trip_openings.${index}.trip_opening_start_date`, {
                    required: "Start date is required",
                  })}
                />
                {errors?.trip_openings?.[index]?.trip_opening_start_date && (
                  <p className={styles.error}>
                    {errors.trip_openings[index].trip_opening_start_date.message}
                  </p>
                )}

                <label className={styles.formLabel}>End Date</label>
                <input
                  className={styles.formInput}
                  type="date"
                  {...register(`trip_openings.${index}.trip_opening_end_date`, {
                    required: "End date is required",
                  })}
                />
                {errors?.trip_openings?.[index]?.trip_opening_end_date && (
                  <p className={styles.error}>
                    {errors.trip_openings[index].trip_opening_end_date.message}
                  </p>
                )}

                <label className={styles.formLabel}>Price</label>
                <input
                  className={styles.formInput}
                  type="number"
                  step="0.01"
                  {...register(`trip_openings.${index}.trip_opening_price`, {
                    required: "Price is required",
                  })}
                />
                {errors?.trip_openings?.[index]?.trip_opening_price && (
                  <p className={styles.error}>
                    {errors.trip_openings[index].trip_opening_price.message}
                  </p>
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

                <div className={styles.availabilityContainer}>
                  <Checkbox
                    {...register(`trip_openings.${index}.is_limited_availability`)}
                    defaultChecked
                    color="default"
                    sx={{
                      color: green[600],
                      '&.Mui-checked': {
                        color: green[600],
                      },
                    }}
                  />
                  <label className={styles.checkboxLabel}>Limit Availability?</label>
                </div>

                {isLimitedAvailability && (
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
                <div className={styles.deleteButton}>
                <LinkWithIconButton
                  label="Delete trip opening"
                  icon={<FaTrash />}
                  variant="delete"
                  onClick={() => {
                    removeTripOpening(index);
                    setOpeningsDropdownOpen((prev) => prev.filter((_, i) => i !== index));
                  }}
                />
              </div>
              </div>
            )}
          </div>
        );
      })}

      <LinkWithIconButton
        label="Add Trip Opening"
        icon={<FaPlus />}
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
          setOpeningsDropdownOpen((prev) => [...prev, false]);
        }}
      />
    </div>
  );
};

export default TripOpeningsForm;
