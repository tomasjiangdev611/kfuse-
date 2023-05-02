import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator } from 'utils/timeNs';
import React from 'react';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';

const KubernetesDeploymentTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
) => [
  {
    key: 'kube_deployment',
    label: 'Deployment',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.deployment?.metadata?.name}
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
            onClick={filterCluster('Cluster', row.deployment)}
          >
            {
              row.deployment?.tags
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
            onClick={filterNamespace('Namespace', row.deployment)}
          >
            {row.deployment?.metadata?.namespace}
          </button>
        }
      />
    ),
  },
  {
    key: 'deploymentStrategy',
    label: 'Strategy',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.deployment?.deploymentStrategy}
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
            {row.deployment &&
              row.deployment.metadata &&
              ageCalculator(row.deployment?.metadata.creationTimestamp)}
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
            {row.deployment?.replicas}
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
            {row.deployment?.replicasDesired}
          </button>
        }
      />
    ),
  },
  {
    key: 'updatedReplicas',
    label: 'Up to Date',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.deployment?.updatedReplicas}
          </button>
        }
      />
    ),
  },
  {
    key: 'availableReplicas',
    label: 'Available',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.deployment?.availableReplicas}
          </button>
        }
      />
    ),
  },
];

export default KubernetesDeploymentTable;
