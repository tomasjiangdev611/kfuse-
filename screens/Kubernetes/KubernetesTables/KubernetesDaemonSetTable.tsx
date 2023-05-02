import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator } from 'utils/timeNs';
import React from 'react';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';
import { getSelector } from '../utils/selectorsfunction';

const KubernetesDaemonSetTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
) => [
  {
    key: 'kube_daemon_set',
    label: 'Daemon Set',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.daemonSet?.metadata?.name}
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
            onClick={filterCluster('Cluster', row.daemonSet)}
          >
            {
              row.daemonSet?.tags
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
            onClick={filterNamespace('Namespace', row.daemonSet)}
          >
            {row.daemonSet?.metadata?.namespace}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.currentNumberScheduled',
    label: 'Status',
    renderCell: ({ row }: RenderCellProps) => (
      <button
        className="kubernetes__buttons"
        onClick={setActiveFunctionNameHandler(row)}
      >
        <ChipWithLabel
          className="daemonset__status__margin"
          color={colorsByFunctionName['ok']}
          label={row.daemonSet?.status?.currentNumberScheduled || ''}
        />
        <ChipWithLabel
          className="daemonset__status__margin"
          color={colorsByFunctionName['pending']}
          label={row.daemonSet?.status?.desiredNumberScheduled || ''}
        />
        <ChipWithLabel
          className="daemonset__status__margin"
          color={colorsByFunctionName['alerting']}
          label={row.daemonSet?.status?.updatedNumberScheduled || ''}
        />
      </button>
    ),
  },
  {
    key: 'headerSelectors',
    label: 'Selectors',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {getSelector(row.daemonSet)}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec?.deploymentStrategy',
    label: 'Strategy',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.daemonSet?.spec?.deploymentStrategy}
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
            {row.daemonSet &&
              row.daemonSet.metadata &&
              ageCalculator(row.daemonSet.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
];

export default KubernetesDaemonSetTable;
