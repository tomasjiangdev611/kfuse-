import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator } from 'utils/timeNs';
import React from 'react';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';

const KubernetesServiceAccountTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
) => [
  {
    key: 'kube_service_account',
    label: 'Service Account',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.serviceAccount?.metadata?.name}
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
            onClick={filterCluster('Cluster', row.serviceAccount)}
          >
            {
              row.serviceAccount?.tags
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
            onClick={filterNamespace('Namespace', row.serviceAccount)}
          >
            {row.serviceAccount?.metadata?.namespace}
          </button>
        }
      />
    ),
  },
  {
    key: 'automountServiceAccountToken',
    label: 'Automount Token',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.serviceAccount?.automountServiceAccountToken === 'true'
              ? 'true'
              : 'false'}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerSecretsNames',
    label: 'Secret Names',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.serviceAccount?.secrets
              ? row.serviceAccount?.secrets[0]?.name
              : ''}
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
            {row.serviceAccount &&
              row.serviceAccount.metadata &&
              ageCalculator(row.serviceAccount.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerSecrets',
    label: 'Secrets',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>{'1'}</button>
        }
      />
    ),
  },
];

export default KubernetesServiceAccountTable;
