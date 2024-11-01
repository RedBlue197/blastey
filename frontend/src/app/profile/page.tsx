import HostTrips from './host-trips/HostTrips';
import UserHistory from './user-history/UserHistory';
import UserInformations from './user-informations/UserInformations';
import styles from './styles.css'; // Assuming CSS module for this component

const ProfilePage = () => {
  return (
    <div className={styles.profileContainer}>
      {/* User Information Section */}
      <div className={styles.userInfoSection}>
        <UserInformations />
      </div>

      {/* User History Section */}
      <div className={styles.userHistorySection}>
        <UserHistory />
      </div>

      {/* Host Trips Section */}
      <div className={styles.hostTripsSection}>
        <HostTrips />
      </div>
    </div>
  );
};

export default ProfilePage;
