import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator, calculateCapacity } from 'utils/timeNs';
import React from 'react';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';
import colorsByLogLevel from 'constants/colorsByLogLevel';
import { RequestResult } from 'types/Request';

const KubernetesNamespaceTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  podsCount: RequestResult,
  deploymentsCount: RequestResult,
  daemonSetCount: RequestResult,
  cronjobsCount: RequestResult,
  statefullSetCount: RequestResult,
  namespaceCPUUtilized: Array<any>,
  namespaceMemUtilized: Array<any>,
) => [
  {
    key: 'kube_namespace',
    label: 'Namespace',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.namespace ? row.namespace.metadata?.name : row.metadata?.name}
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
            onClick={filterCluster('Cluster', row.namespace)}
          >
            {row.namespace
              ? row?.namespace?.tags
                  .find((element: string | string[]) => {
                    return element.includes('kube_cluster_name');
                  })
                  .split(':')[1]
              : row?.tags
              ? row?.tags
                  .find((element: string | string[]) => {
                    return element.includes('kube_cluster_name');
                  })
                  .split(':')[1]
              : ''}
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
          <button
            className="kubernetes__right-sidebar__message__header__status"
            style={{
              backgroundColor:
                colorsByLogLevel[
                  row.namespace
                    ? row.namespace.status?.toLowerCase() === 'active'
                      ? 'running'
                      : 'error'
                    : ''
                ],
            }}
            key={row.name}
            onClick={setActiveFunctionNameHandler(row)}
          >
            {row?.namespace?.status}
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
            {row.namespace
              ? ageCalculator(row.namespace?.metadata.creationTimestamp)
              : ageCalculator(row.metadata?.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerCpuUsage',
    label: 'CPU Usage',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {namespaceCPUUtilized?.map((data) => {
              const clusterNameTag = row.namespace?.tags?.find((tag) =>
                tag.includes('kube_cluster_name'),
              );
              const clusterName = clusterNameTag
                ? clusterNameTag.split(':')[1]
                : undefined;
              const isMatch =
                data?.metric?.kube_cluster_name === clusterName &&
                data?.metric?.kube_namespace === row.namespace?.metadata?.name;
              if (isMatch) {
                const value = data?.value[1];
                const splitValue = value.split('.')[0];

                return splitValue.length > 6
                  ? (value / 1000000).toFixed(2) + ' µCPUs'
                  : (value / 1000).toFixed(2) + ' mCPUs';
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerMemUsage',
    label: 'Mem Usage',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {namespaceMemUtilized?.map((element) => {
              if (
                element?.metric?.kube_cluster_name ===
                  row.namespace?.tags
                    .find((element) => {
                      return element.includes('kube_cluster_name');
                    })
                    .split(':')[1] &&
                element?.metric?.kube_namespace ===
                  row.namespace?.metadata?.name
              ) {
                return calculateCapacity(element?.value[1]);
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
            {podsCount?.map((element) => {
              if (
                element?.groupBys &&
                element?.groupBys[0]?.value === row.namespace?.metadata?.name
              ) {
                return element.count;
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerDeployments',
    label: 'Deployments',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {deploymentsCount?.map((element) => {
              if (
                element?.groupBys &&
                element?.groupBys[0]?.value === row.namespace?.metadata?.name
              ) {
                return element.count;
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerDaemonsets',
    label: 'Daemon Sets',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {daemonSetCount?.map((element) => {
              if (
                element?.groupBys[0]?.value === row.namespace?.metadata?.name
              ) {
                return element.count;
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerCronjobs',
    label: 'Cronjobs',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {cronjobsCount?.map((element) => {
              if (
                element?.groupBys &&
                element?.groupBys[0]?.value === row.namespace?.metadata?.name
              ) {
                return element.count;
              }
            })}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerStatefulsets',
    label: 'Stateful Sets',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {statefullSetCount?.map((element) => {
              if (
                element?.groupBys[0]?.value === row.namespace?.metadata?.name
              ) {
                return element.count;
              }
            })}
          </button>
        }
      />
    ),
  },
];

export default KubernetesNamespaceTable;
