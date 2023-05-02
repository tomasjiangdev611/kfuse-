import dayjs from 'dayjs';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { fetchJson } from 'requests';
import { onPromiseError } from 'utils';
import TransactionsItemChartResizer from './TransactionsItemChartResizer';

const fetchChart = (key, name, date) => {
  const { startTimeUnix, endTimeUnix } = date;
  const start = dayjs.unix(startTimeUnix).toISOString();
  const end = dayjs.unix(endTimeUnix).toISOString();
  const step = Math.max(Math.round((endTimeUnix - startTimeUnix) / 1000), 1);

  return fetchJson(
    `api/v1/query_range?query=${key}{transactionName="${name}"}&start=${start}&end=${end}&step=${step}s`,
  )
    .then((response) => {
      return response?.data?.result[0]?.values || [];
    }, onPromiseError)
    .then((values) => {
      return values.map((value) => ({
        timestamp: value[0],
        value: Number(value[1]),
      }));
    }, onPromiseError);
};

const TransactionsItemChart = ({ aggregate, date, label, name }) => {
  const fetchChartRequest = useRequest(fetchChart);
  const data = fetchChartRequest.result || [];

  useEffect(() => {
    fetchChartRequest.call(aggregate, name, date);
  }, [date]);

  return (
    <div className="transactions__item__chart">
      <div className="transactions__item__chart__label">{label}</div>
      <TransactionsItemChartResizer data={data} />
    </div>
  );
};

export default TransactionsItemChart;
