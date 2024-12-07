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
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function TrafficVisualization({ waitingTimes, currentSignal }) {
  const directions = ['North', 'East', 'South', 'West'];
  
  const data = {
    labels: directions,
    datasets: [{
      label: 'Waiting Vehicles',
      data: waitingTimes,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Traffic Wait Times by Direction'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Current Signal Status</h2>
        <div className="grid grid-cols-2 gap-4">
          {directions.map((direction, index) => (
            <div
              key={direction}
              className={`p-4 rounded-lg ${
                currentSignal === index
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {direction}: {currentSignal === index ? 'Green' : 'Red'}
            </div>
          ))}
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}