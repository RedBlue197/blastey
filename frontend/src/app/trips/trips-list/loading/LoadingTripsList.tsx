import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const LoadingTripsList = () => {
    return (
    <Skeleton variant="rectangular" width="100%">
      <div style={{ paddingTop: '57%' }} />
    </Skeleton>
    );
  };
  
  export default LoadingTripsList;
  