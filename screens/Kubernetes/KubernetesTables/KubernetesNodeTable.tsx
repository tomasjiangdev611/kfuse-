import React from 'react';
import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator, calculateCapacity } from 'utils/timeNs';
import { RenderCellProps } from '../KubernetesTable';
import colorsByLogLevel from 'constants/colorsByLogLevel';
import D3ProgressBar from 'components/D3/D3ProgressBar';

const KubernetesNodeTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  nodesCPUUsageData: Array<any>,
  nodesCPUPercentageData: Array<any>,
  nodesMemUsageData: Array<any>,
  nodesMemPercentageData: Array<any>,
) => [
  {
    key: 'kube_node',
    label: 'Node',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.node?.metadata?.name}
          </button>
        }
      />
    ),
  },
  {
    key: 'metadata.creationTimestamp',
    label: 'Age',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.node &&
              row.node.metadata &&
              ageCalculator(row.node.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.status',
    label: 'Status',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            className="kubernetes__right-sidebar__message__header__status"
            style={{
              backgroundColor:
                colorsByLogLevel[
                  row.node?.status?.status === 'Ready' ? 'running' : 'error'
                ],
            }}
            key={row.name}
            onClick={setActiveFunctionNameHandler(row)}
          >
            {row.node?.status?.status}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.capacity.cpu',
    label: 'Cpu Capacity',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {(row.node?.status?.allocatable?.cpu / 1000).toFixed(2)}/
            {(row.node?.status?.capacity?.cpu / 1000).toFixed(2)} CPUs
          </button>
        }
      />
    ),
  },
  {
    key: 'headerCpuUsage',
    label: '% CPU Usage',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {nodesCPUPercentageData?.map((data) => {
              if (data?.metric?.host?.includes(row.node?.metadata?.name)) {
                const value = data?.value[1] * 100;
                return <D3ProgressBar key={row.name} total={value} />;
              } else if (
                row.node?.metadata?.annotations?.some((str) =>
                  str.includes(data?.metric?.host),
                )
              ) {
                const value = data?.value[1] * 100;
                return <D3ProgressBar key={row.name} total={value} />;
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.capacity.memory',
    label: 'Mem Capacity',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {calculateCapacity(row.node?.status?.allocatable?.memory)} /
            {calculateCapacity(row.node?.status?.capacity?.memory)}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerMemUsage',
    label: '% Mem Usage',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {nodesMemPercentageData?.map((data) => {
              if (data?.metric?.host?.includes(row.node?.metadata?.name)) {
                const value = data?.value[1] * 100;
                return <D3ProgressBar key={row.name} total={value} />;
              } else if (
                row.node?.metadata?.annotations?.some((str) =>
                  str.includes(data?.metric?.host),
                )
              ) {
                const value = data?.value[1] * 100;
                return <D3ProgressBar key={row.name} total={value} />;
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'unschedulable',
    label: 'Schedulability',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            className="kubernetes__right-sidebar__message__header__status"
            style={{
              backgroundColor:
                colorsByLogLevel[
                  row.node?.unschedulable === 'true' ? 'error' : 'running'
                ],
            }}
            key={row.name}
            onClick={setActiveFunctionNameHandler(row)}
          >
            {row.node?.unschedulable === 'true' ? 'Inactive' : 'Active'}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerRoles',
    label: 'Roles',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.node?.roles}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.kubeletVersions',
    label: 'Kubelet Version',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.node?.status?.kubeletVersions}
          </button>
        }
      />
    ),
  },
];

export default KubernetesNodeTable;
