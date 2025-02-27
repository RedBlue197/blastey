// src/app/components/dashboard/ProfessionalDashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styles from './ProfessionalDashboard.module.css';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { TextField, Button } from '@mui/material'; // Import TextField and Button
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fr, enUS } from 'date-fns/locale';
import {format, startOfWeek, endOfWeek, subDays} from 'date-fns';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface DashboardProps {
    // You can pass any specific data to the dashboard as props
}

const ProfessionalDashboard: React.FC<DashboardProps> = () => {
    const { t, i18n } = useTranslation();

    const [startDate, setStartDate] = useState<Date | null>(() => {
      const today = new Date();
      return startOfWeek(today, { weekStartsOn: 1 }); // Monday as the first day
    });
    const [endDate, setEndDate] = useState<Date | null>(() => {
      const today = new Date();
      return today
    });

    // KPI data
    const totalSales = 54000; // Dummy total sales value
    const currency = 'USD'; // Currency

    // Dummy data for the table
    const tableData = [
        { id: 1, name: 'Trip A', price: 120, rating: 4.5 },
        { id: 2, name: 'Trip B', price: 150, rating: 4.2 },
        { id: 3, name: 'Trip C', price: 100, rating: 4.8 },
        { id: 4, name: 'Trip D', price: 200, rating: 4.9 }, // Added more data
        { id: 5, name: 'Trip E', price: 90, rating: 4.0 },
    ];

    // Dummy data for the chart
    const chartData = {
        labels: [t('dashboard.jan'), t('dashboard.feb'), t('dashboard.mar'), t('dashboard.apr'), t('dashboard.may'), t('dashboard.jun')],
        datasets: [
            {
                label: t('dashboard.sales'),
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: t('dashboard.salesChartTitle'),
            },
        },
    };

    const handleSubmit = () => {
        // Handle the date range submission here
        if (startDate && endDate) {
            console.log('Selected Date Range:', startDate, endDate);
            // You can now filter your data based on the selected date range
            // and update your chart and table data accordingly
        }
    };

      const getLocale = () => {
        switch (i18n.language) {
          case 'fr':
            return fr;
          default:
            return enUS;
        }
      };


    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.dashboardTitle}>{t('dashboard.title')}</h1>
             {/* Date Range Selection */}
            <div className={styles.dateRangeSection}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getLocale()}>
                      <DatePicker
                           label={t('dashboard.startDate')}
                             value={startDate}
                           onChange={(date) => setStartDate(date)}
                           renderInput={(params) => <TextField {...params} />}
                                 />
                <DatePicker
                           label={t('dashboard.endDate')}
                           value={endDate}
                            onChange={(date) => setEndDate(date)}
                            renderInput={(params) => <TextField {...params} />}
                              />
                </LocalizationProvider>
                <Button variant="contained" onClick={handleSubmit}>
                    {t('dashboard.search')}
                </Button>
            </div>
              <div className={styles.kpiSection}>

                <div className={styles.kpi}>
                    <h2>{t('dashboard.totalSales')}</h2>
                    <p className={styles.kpiValue}>
                        {totalSales.toLocaleString('en-US', {
                            style: 'currency',
                            currency: currency,
                        })}
                    </p>
                </div>
                <div className={styles.kpi}>
                    <h2>{t('dashboard.totalSales')}</h2>
                    <p className={styles.kpiValue}>
                        {totalSales.toLocaleString('en-US', {
                            style: 'currency',
                            currency: currency,
                        })}
                    </p>
                </div>
                <div className={styles.kpi}>
                    <h2>{t('dashboard.totalSales')}</h2>
                    <p className={styles.kpiValue}>
                        {totalSales.toLocaleString('en-US', {
                            style: 'currency',
                            currency: currency,
                        })}
                    </p>
                </div>
                <div className={styles.kpi}>
                    <h2>{t('dashboard.totalSales')}</h2>
                    <p className={styles.kpiValue}>
                        {totalSales.toLocaleString('en-US', {
                            style: 'currency',
                            currency: currency,
                        })}
                    </p>
                </div>
            </div>

            <div className={styles.dashboardContent}>
                <div className={styles.widget}>
                    <h2>{t('dashboard.widget1Title')}</h2>
                    <p>{t('dashboard.widget1Content')}</p>
                </div>

                <div className={styles.widget}>
                    <h2>{t('dashboard.widget2Title')}</h2>
                    <p>{t('dashboard.widget2Content')}</p>
                </div>

                {/* Table Widget */}
                <div className={styles.widget}>
                    <h2>{t('dashboard.tripTableTitle')}</h2>
                    <div className={styles.tableContainer}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>{t('dashboard.tableHeaderId')}</th>
                                    <th>{t('dashboard.tableHeaderName')}</th>
                                    <th>{t('dashboard.tableHeaderPrice')}</th>
                                    <th>{t('dashboard.tableHeaderRating')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>${item.price}</td>
                                        <td>{item.rating}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart Widget */}
                <div className={styles.widget}>
                    <h2>{t('dashboard.salesChartTitle')}</h2>
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDashboard;