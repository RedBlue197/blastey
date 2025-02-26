import { useState } from 'react';
import { createOrUpdateTrip } from '@/services/internal_services/professional_services/trip_api_handler';
import styles from './TripFormModal.module.css';

interface TripFormModalProps {
  trip: Trip | null;
  closeModal: () => void;
  refreshTrips: () => void;
}

const TripFormModal: React.FC<TripFormModalProps> = ({ trip, closeModal, refreshTrips }) => {
  const [formData, setFormData] = useState({
    title: trip?.title || '',
    description: trip?.description || '',
    origin: trip?.origin || '',
    destination: trip?.destination || '',
    departureDate: trip?.departureDate || '',
    returnDate: trip?.returnDate || '',
    price: trip?.price || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrUpdateTrip(formData, trip?.id); // Call API for create/update
    refreshTrips();  // Reload trips
    closeModal();  // Close modal
  };

  return (
    <div className={styles.modal}>
      <form onSubmit={handleSubmit}>
      <h2 className={styles.heading}>{trip ? 'Update Trip' : 'Create New Trip'}</h2>

<label className={styles.label}>Title</label>
<input type="text" name="title" value={formData.title} onChange={handleChange} required className={styles.input} />

<label className={styles.label}>Description</label>
<textarea name="description" value={formData.description} onChange={handleChange} className={styles.textarea} />

<label className={styles.label}>Origin</label>
<input type="text" name="origin" value={formData.origin} onChange={handleChange} className={styles.input} />

<label className={styles.label}>Destination</label>
<input type="text" name="destination" value={formData.destination} onChange={handleChange} className={styles.input} />

<label className={styles.label}>Departure Date</label>
<input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} className={styles.dateInput} />

<label className={styles.label}>Return Date</label>
<input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} className={styles.dateInput} />

<label className={styles.label}>Price</label>
<input type="number" name="price" value={formData.price} onChange={handleChange} className={styles.numberInput} />

<div className={styles.buttons}>
  <button type="submit" className={styles.button}>Save</button>
  <button type="button" onClick={closeModal} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
</div>

      </form>
    </div>
  );
};

export default TripFormModal;
