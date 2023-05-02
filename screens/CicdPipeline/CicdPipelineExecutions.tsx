import React, { useEffect, useState } from 'react';
import { useEventsState } from 'screens/Events/hooks';
import { TimeUnit } from 'types/TimeUnit';
import { formatNs } from 'utils/timeNs';
import PipelineExecutionChart from './PipelineExecutionChart';

type Props = {
  tableData: [];
};

const CicdPipelineExecutions = ({ tableData }: Props) => {
  const [duration] = useState([]);
  const [timeStamp] = useState([]);
  const eventsState = useEventsState();
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    if (tableData) {
      tableData.forEach((row) => {
        duration.push({
          duration: formatNs(
            row?.span.endTimeNs - row?.span.startTimeNs,
            TimeUnit.SECONDS,
          ),
        });
        timeStamp.push(formatNs(row?.span.endTimeNs, TimeUnit.SECONDS));
      });
      setGraphData({
        calledAtLeastOnce: true,
        error: null,
        isLoading: false,
        result: {
          bars: duration,
          eventLevels: [
            {
              label: 'duration',
              color: '#c3e29c',
            },
          ],
          labels: timeStamp,
        },
      });
    }
  }, [tableData]);

  return (
    <div key={tableData.length} style={{ width: '100%', height: 100 }}>
      {graphData && tableData && (
        <PipelineExecutionChart
          eventsState={eventsState}
          eventStackedCountsRequest={graphData}
        />
      )}
    </div>
  );
};

export default CicdPipelineExecutions;
