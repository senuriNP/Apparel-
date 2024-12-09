import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import './DeadlineStatusChart.css';

const DeadlineStatusChart = () => {
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    const fetchDeadlines = async () => {
      const response = await axios.get('http://localhost:5000/api/deadlines');
      setDeadlines(response.data);
    };
    fetchDeadlines();
  }, []);

  // Prepare data for the pie chart
  const getStatusData = () => {
    const statusCounts = {
      'In progress': 0,
      Completed: 0,
      Failed: 0,
    };

    deadlines.forEach(deadline => {
      statusCounts[deadline.status]++;
    });

    return {
      
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#f7e674', '#3fd46c', '#FF6384'],
      }],
    };
  };

  return (
    <div className="chart-containerDed">
      <h3>Deadline Status Distribution</h3>
      <Pie data={getStatusData()} />
    </div>
  );
};

export default DeadlineStatusChart;
