import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator } from 'utils/timeNs';
import React from 'react';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';
import colorsByLogLevel from 'constants/colorsByLogLevel';
import D3ProgressBar from 'components/D3/D3ProgressBar';

const KubernetesPodTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
  podCpuUsageData: Array<any>,
  podMemUsageData: Array<any>,
) => [
  {
    key: 'pod_name',
    label: 'Pod',
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
    key: 'pod_status',
    label: 'Status',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            className="kubernetes__right-sidebar__message__header__status"
            style={{
              backgroundColor: colorsByLogLevel[row.pod?.status.toLowerCase()],
            }}
            key={row.name}
            onClick={setActiveFunctionNameHandler(row)}
          >
            {row.pod?.status}
          </button>
        }
      />
    ),
  },
  {
    key: 'kube_cluster_name',
    label: 'Cluster',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            style={{ color: colors.blue }}
            onClick={filterCluster('Cluster', row.pod)}
          >
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
    key: 'kube_namespace',
    label: 'Namespace',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            style={{ color: colors.blue }}
            onClick={filterNamespace('Namespace', row.pod)}
          >
            {row.pod?.metadata?.namespace}
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
            {row.pod &&
              row.pod.metadata &&
              ageCalculator(row.pod.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerReady',
    label: 'Ready',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.pod?.containerStatuses &&
            row.pod?.containerStatuses[0]?.ready === true
              ? '1/1'
              : '0/0'}
          </button>
        }
      />
    ),
  },
  {
    key: 'restartCount',
    label: 'Restarts',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.pod?.restartCount ? row.pod.restartCount : '0'}
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
            {podCpuUsageData?.map((data) => {
              const podName = row?.pod?.metadata?.name;
              const clusterName = row.pod?.tags
                .find((tag) => tag.includes('kube_cluster_name'))
                .split(':')[1];
              const namespace = row.pod?.metadata?.namespace;

              if (
                data?.metric?.pod_name === podName &&
                data?.metric?.kube_cluster_name === clusterName &&
                data?.metric?.kube_namespace === namespace
              ) {
                const value = (data?.value[1] * 100)?.toFixed(2);
                return <D3ProgressBar key={podName} total={value} />;
              }
            })}
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
            {podMemUsageData?.map((element) => {
              if (
                element?.metric?.pod_name === row?.pod?.metadata?.name &&
                element?.metric?.kube_cluster_name ===
                  row.pod?.tags
                    .find((element) => {
                      return element.includes('kube_cluster_name');
                    })
                    .split(':')[1] &&
                element?.metric?.kube_namespace === row.pod?.metadata?.namespace
              ) {
                return (
                  <D3ProgressBar
                    key={element?.metric?.pod_name}
                    total={(element?.value[1] * 100)?.toFixed(2)}
                  />
                );
              }
            })}
          </button>
        }
      />
    ),
  },
];

export default KubernetesPodTable;
