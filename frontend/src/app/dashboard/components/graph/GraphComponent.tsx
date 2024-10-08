import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GraphComponentProps {
  labels: string[];
  dataPoints: number[];
}

const GraphComponent: React.FC<GraphComponentProps> = ({ labels, dataPoints }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Sample Data',
        data: dataPoints,
        fill: false,
        borderColor: '#4bc0c0',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sample Line Chart',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default GraphComponent;
