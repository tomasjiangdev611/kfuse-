import React from 'react';
import { formatMilliseconds } from './utils';

const formatGroup = (group) => {
  const keys = Object.keys(group);
  if (keys.length) {
    const key = keys[0];
    return `${key}=${group[key]}`;
  }

  return '';
};

const items = (state) => {
  const result = [
    {
      label: 'Average Duration',
      value: formatMilliseconds(state.averageDuration),
    },
    { label: 'Fingerprints', value: state.nodes.length.toLocaleString() },
    { label: 'Total Events', value: state.totalCount.toLocaleString() },
    {
      label: 'Total Failed Transactions',
      value: state.totalFailedTransactions,
    },
    { label: 'Total Transactions', value: state.totalTransactions },
    { label: 'Transitions', value: state.links.length.toLocaleString() },
  ];

  return result;
};

const LogsTransactionsStats = ({ transactions }) => {
  const { state } = transactions;

  return null;
};

export default LogsTransactionsStats;
