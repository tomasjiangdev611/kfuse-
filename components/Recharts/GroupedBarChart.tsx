import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Sunday',
    info: 3490,
    warn: 4300,
    error: 2100,
  },
  {
    name: 'Monday',
    info: 4000,
    warn: 2400,
    error: 2400,
  },
  {
    name: 'Tuesday',
    info: 3000,
    warn: 1398,
    error: 2210,
  },
  {
    name: 'Wednesday',
    info: 2000,
    warn: 9800,
    error: 2290,
  },
  {
    name: 'Thursday',
    info: 2780,
    warn: 3908,
    error: 2000,
  },
  {
    name: 'Friday',
    info: 1890,
    warn: 4800,
    error: 2181,
  },
  {
    name: 'Saturday',
    info: 2390,
    warn: 3800,
    error: 2500,
  },
];

const GroupedBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="info" fill="#c5d6f3" />
        <Bar dataKey="warn" fill="#FFD800" />
        <Bar dataKey="error" fill="#da545b" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GroupedBarChart;
