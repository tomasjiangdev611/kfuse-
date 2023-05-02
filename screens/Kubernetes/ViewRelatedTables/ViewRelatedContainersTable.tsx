import ChipWithLabel from 'components/ChipWithLabel';
import dayjs from 'dayjs';
import { ageDuration } from 'utils/timeNs';
import React from 'react';
import { RenderCellProps } from '../KubernetesTable';

const ViewRelatedContainersTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
) => [
  {
    key: 'name',
    label: 'Name',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.pod?.metadata?.name}
          </button>
        }
      />
    ),
  },
  {
    key: 'status',
    label: 'Status',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.pod?.status}
          </button>
        }
      />
    ),
  },
  {
    key: 'ready',
    label: 'Ready',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {
              row.pod?.tags
                .find((element) => {
                  return element.includes('kube_cluster_name');
                })
                .split(':')[1]
            }
          </button>
        }
      />
    ),
  },
  {
    key: 'cpu',
    label: 'CPU',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.pod?.metadata?.namespace}
          </button>
        }
      />
    ),
  },
  {
    key: 'RssMemory',
    label: 'RSS Memory',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.pod &&
              row.pod.metadata &&
              ageDuration(
                row.pod.metadata.creationTimestamp,
                dayjs().unix() * 1000 * 1000,
              )}
          </button>
        }
      />
    ),
  },
  {
    key: 'start',
    label: 'Start',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.pod?.containerStatuses[0]?.ready === true ? '1/1' : '0/0'}
          </button>
        }
      />
    ),
  },
  {
    key: 'restarts',
    label: 'Restarts',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.pod?.containerStatuses[0]?.restartCount
              ? row.pod.containerStatuses[0].restartCount
              : '0'}
          </button>
        }
      />
    ),
  },
];

export default ViewRelatedContainersTable;
