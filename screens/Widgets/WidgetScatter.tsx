import React from 'react';
import { Scatter } from 'react-chartjs-2';

const rand = () => Math.round(Math.random() * 20 - 10);

const data = {
  datasets: [
    {
      label: 'A dataset',
      data: [
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
        { x: rand(), y: rand() },
      ],
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
  ],
};

const options = {
  animation: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const WidgetScatter = () => {
  return <Scatter data={data} options={options} />;
};

export default WidgetScatter;
