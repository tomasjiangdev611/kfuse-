import React, { ReactElement } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 400,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 30,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 20,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 278,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 189,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 349,
    pv: 4300,
    amt: 2100,
  },
];

const mockedData = data.reduce(() => {
  const result = [];
  for (let i = 0; i < 100; i += 1) {
    result.push(data[Math.floor(Math.random() * (data.length + 1))]);
  }

  return result;
});

const StackedBarChart = (): ReactElement => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={mockedData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <Tooltip />
        <YAxis domain={[0, 20000]} hide type="number" />
        <Bar dataKey="pv" stackId="a" fill="#c5d6f3" />
        <Bar dataKey="uv" stackId="a" fill="#da545b" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
