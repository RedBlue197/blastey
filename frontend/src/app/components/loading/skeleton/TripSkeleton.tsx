import styles from './TripSkeleton.module.css';

const Skeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
    </div>
  );
};

export default Skeleton;
