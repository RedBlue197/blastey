// pages/protected.tsx

"use client";
import useAuthRedirect from '@/hooks/useAuthRedirect';
import React from 'react';
import Card from './components/card/Card';
import Graph from './components/graph/Graph';
import Table from './components/table/Table';
import styles from './styles.css';
import Dashboard from './dashboard/Dashboard';

const Dashboard: React.FC = () => {

  return (
    <div >
      <Dashboard/>
    </div>
  );
};

export default Dashboard;
