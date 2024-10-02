import React, { Suspense } from 'react';
import styles from './Graph.module.css';

const GraphComponent = React.lazy(() => import('./GraphComponent')); // Assumes a graphing library is used here

const Graph: React.FC = () => {
  return (
    <div className={styles.graph}>
      <Suspense fallback={<div>Loading Graph...</div>}>
        <GraphComponent />
      </Suspense>
    </div>
  );
};

export default Graph;
