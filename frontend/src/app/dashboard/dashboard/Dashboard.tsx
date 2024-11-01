// pages/protected.tsx

"use client";
import useAuthRedirect from '@/hooks/useAuthRedirect';
import React from 'react';
import Card from './components/card/Card';
import Graph from './components/graph/Graph';
import Table from './components/table/Table';
import styles from './styles.css';

const Dashboard: React.FC = () => {
  const allowedRoles = ['admin', 'editor']; // Example roles

  // useAuthRedirect(allowedRoles); // Call the redirect hook with allowed roles
  const columns = ['Name', 'Age', 'Position'];
  const data = [
    ['John Doe', '28', 'Software Engineer'],
    ['Jane Doe', '25', 'Product Manager']
  ];

  return (
    <div className={styles.dashboard}>
      {/* First row of Cards */}
      <div className={styles.row}>
        <Card title="Total Sales" content="$20,000" />
        <Card title="New Users" content="150" />
        <Card title="Total Orders" content="200" />
      </div>

      {/* Row for Graphs */}
      <div className={styles.row}>
        <Graph />
        <Graph />
      </div>

      {/* Row for Calendar */}
      {/* <div className={styles.calendarRow}>
        <Calendar />
      </div> */}

      {/* Row for Table */}
      <div className={styles.tableRow}>
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
