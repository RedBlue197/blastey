import React, { Suspense } from 'react';
import styles from './Graph.module.css';

// Lazy load the GraphComponent
const GraphComponent = React.lazy(() => import('./GraphComponent'));

const Graph: React.FC = () => {
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const dataPoints = [65, 59, 80, 81, 56, 55, 40];

  return (
    <div className={styles.graphContainer}>
      <Suspense fallback={<div>Loading Graph...</div>}>
        <GraphComponent labels={labels} dataPoints={dataPoints} />
      </Suspense>
    </div>
  );
};

export default Graph;
