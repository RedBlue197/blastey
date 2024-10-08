import React, { Suspense } from 'react';
import styles from './Table.module.css';

interface TableProps {
  columns: string[];
  data: string[][];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <div className={styles.tableContainer}>
      <Suspense fallback={<div>Loading Table...</div>}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={styles.td}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Suspense>
    </div>
  );
};

export default Table;
