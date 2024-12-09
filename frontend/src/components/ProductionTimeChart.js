// src/components/ProductionTimeChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './ProductionTimeChart.css';

Chart.register(...registerables); // Register chart.js components

const ProductionTimeChart = ({ productionTimes }) => {
  // Prepare data for the line chart
  const chartData = {
    labels: productionTimes.map((prod) => new Date(prod.date).toLocaleDateString()), // X-axis: Dates
    datasets: [
      {
        label: 'Average Production Time',
        data: productionTimes.map((prod) => prod.calculatedTime), // Y-axis: Avg production times
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1, // Smooth curve
      },
    ],
  };

  // Define chart options
  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date', // X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Production Time (hrs)', // Y-axis label
        },
        beginAtZero: true, // Ensures the Y-axis starts from 0
      },
    },
    responsive: true, // Makes the chart responsive
    maintainAspectRatio: false, // Allows resizing
  };

  return (
    <div >
        
    <div className="chart-container1">
        
      <Line data={chartData} options={chartOptions} />
    </div>
    </div>
  );
};

export default ProductionTimeChart;
