import dayjs from 'dayjs';
import { useForm, useWebsocket } from 'hooks';
import React, { useEffect } from 'react';
import { DateSelection, FacetName } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { useLogsState, useTransactions } from './hooks';
import LogsTransactionsHeader from './LogsTransactionsHeader';
import LogsTransactionsBody from './LogsTransactionsBody';

type QueryBuilderArgs = {
  date: DateSelection;
  facets: string[];
};

const queryBuilder = ({ date, facets }: QueryBuilderArgs) => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return `
subscription {
  getTransactions(
    transactionInput: {
      name: "${uuidv4()}"
      keys: "${facets.join(',')}"
      durationMetric: ""
      failureMetric: ""
      path: ""
    }
    durationSecs: ${durationSecs}
    timestamp: "${endTime.format()}",
  ) {
    name,
    pathStats {
      pathId
      edges {
        startFp
        endFp
        hopTime
      }
      totalTransactions
      durations {
        group
        duration
        startTs
        endTs
      }
      percentileDurations {
        percentileLabel
        example {
          group
          duration
          startTs
          endTs
        }
      }
    }
    averageDuration,
    totalFailedTransactions,
    totalTransactions,
    failedTransactions {
      group
    }
  }
}`;
};

type Props = {
  facetKey: string;
  facetNames: FacetName[];
  logsState: ReturnType<typeof useLogsState>;
};

const LogsTransactionsInner = ({ facetKey, facetNames, logsState }: Props) => {
  const form = useForm({
    durationMetric: '',
    facets: [],
    failureMetric: '',
    name: '',
  });

  const transactions = useTransactions();
  const transactionsWebsocket = useWebsocket({
    onMessage: transactions.onMessage,
    queryBuilder,
  });

  useEffect(() => {
    return () => {
      transactionsWebsocket.stop();
    };
  }, []);

  return (
    <>
      <LogsTransactionsHeader
        facetKey={facetKey}
        facetNames={facetNames}
        form={form}
        logsState={logsState}
        transactions={transactions}
        transactionsWebsocket={transactionsWebsocket}
      />
      <LogsTransactionsBody logsState={logsState} transactions={transactions} />
    </>
  );
};

export default LogsTransactionsInner;
