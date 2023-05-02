import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator, ageDuration } from 'utils/timeNs';
import React from 'react';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';

const KubernetesReplicaSetTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
  filterDeployment: (entity: string, row: any) => () => void,
) => [
  {
    key: 'kube_replica_set',
    label: 'Replica Set',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.replicaSet?.metadata?.name}
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
            onClick={filterCluster('Cluster', row.replicaSet)}
          >
            {
              row.replicaSet?.tags
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
            onClick={filterNamespace('Namespace', row.replicaSet)}
          >
            {row.replicaSet?.metadata?.namespace}
          </button>
        }
      />
    ),
  },
  {
    key: 'kube_deployment',
    label: 'Deployment',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            style={{ color: colors.blue }}
            onClick={filterDeployment('Deployment', row.replicaSet)}
          >
            {
              row.replicaSet?.tags
                .find((element) => {
                  return element.includes('kube_deployment');
                })
                .split(':')[1]
            }
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
            {row.replicaSet &&
              row.replicaSet.metadata &&
              ageCalculator(row.replicaSet.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'replicas',
    label: 'Current',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.replicaSet?.replicas}
          </button>
        }
      />
    ),
  },
  {
    key: 'replicasDesired',
    label: 'Desired',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.replicaSet?.replicasDesired}
          </button>
        }
      />
    ),
  },
  {
    key: 'readyReplicas',
    label: 'Ready',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.replicaSet?.readyReplicas}
          </button>
        }
      />
    ),
  },
];

export default KubernetesReplicaSetTable;
