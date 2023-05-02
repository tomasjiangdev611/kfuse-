import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator, calculateCapacity } from 'utils/timeNs';
import React from 'react';
import { RenderCellProps } from '../KubernetesTable';
import D3ProgressBar from 'components/D3/D3ProgressBar';

const KubernetesClusterTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  podCount: Array<any>,
  clusterCpuUsageData: Array<any>,
  clusterMemUsageData: Array<any>,
) => [
  {
    key: 'kube_cluster_name',
    label: 'Cluster',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.cluster?.clusterName}
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
            {row.cluster && ageCalculator(row.cluster?.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'resourceVersion',
    label: 'Versions',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {Object.keys(row.cluster?.kubeletVersions || {})}
          </button>
        }
      />
    ),
  },
  {
    key: 'nodeCount',
    label: 'Nodes',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.cluster?.nodeCount}
          </button>
        }
      />
    ),
  },
  {
    key: 'cpuCapacity',
    label: 'Cpu Capacity',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {(row.cluster?.cpuAllocatable / 1000).toFixed(2)}/
            {(row.cluster?.cpuCapacity / 1000).toFixed(2)} CPUs
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
            {clusterCpuUsageData?.map((data) => {
              const clusterNameTag = row.cluster?.tags?.find((tag) =>
                tag.includes('kube_cluster_name'),
              );
              const clusterName = clusterNameTag
                ? clusterNameTag.split(':')[1]
                : undefined;
              const isMatch = data?.metric?.kube_cluster_name === clusterName;
              if (isMatch) {
                const value =
                  (data?.value[1] / row.cluster?.cpuAllocatable) * 100;
                return (
                  <D3ProgressBar key={clusterName} total={value.toFixed(2)} />
                );
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'memoryCapacity',
    label: 'Mem Capacity',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {calculateCapacity(row.cluster?.memoryAllocatable)}/{' '}
            {calculateCapacity(row.cluster?.memoryCapacity)}
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
            {clusterMemUsageData?.map((element) => {
              if (
                element?.metric?.kube_cluster_name === row.cluster?.clusterName
              ) {
                return (
                  <D3ProgressBar
                    total={(
                      (element?.value[1] / row.cluster?.memoryAllocatable) *
                      100
                    ).toFixed(2)}
                  />
                );
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerPods',
    label: 'Pods',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {podCount &&
              podCount.map((element) => {
                if (row.cluster?.clusterName === element?.value) {
                  return element?.count;
                }
              })}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerPodUsage',
    label: 'Pod Usage',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {podCount &&
              podCount.map((element) => {
                if (row.cluster?.clusterName === element?.value) {
                  if (
                    element?.count &&
                    (element?.count / row.cluster?.podCapacity) * 100
                  ) {
                    return (
                      <D3ProgressBar
                        total={(
                          (element?.count / row.cluster?.podCapacity) *
                          100
                        ).toFixed(2)}
                      />
                    );
                  }
                }
              })}
          </button>
        }
      />
    ),
  },
];

export default KubernetesClusterTable;
