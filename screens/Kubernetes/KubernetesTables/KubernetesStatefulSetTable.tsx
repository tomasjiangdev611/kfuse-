import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator } from 'utils/timeNs';
import React from 'react';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';
import { getSelector } from '../utils/selectorsfunction';

const KubernetesStatefulSetTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
  filterService: (entity: string, row: any) => () => void,
) => [
  {
    key: 'kube_stateful_set',
    label: 'Stateful Set',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.statefulSet?.metadata?.name}
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
            onClick={filterCluster('Cluster', row.statefulSet)}
          >
            {row.statefulSet?.tags
              ? row.statefulSet?.tags
                  ?.find((element) => {
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
    key: 'kube_namespace',
    label: 'Namespace',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            style={{ color: colors.blue }}
            onClick={filterNamespace('Namespace', row.statefulSet)}
          >
            {row.statefulSet?.metadata?.namespace}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.serviceName',
    label: 'Service',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            style={{ color: colors.blue }}
            onClick={filterService('Service', row.statefulSet)}
          >
            {row.statefulSet?.spec?.serviceName}
          </button>
        }
      />
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
            {getSelector(row.statefulSet)}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.podManagementPolicy',
    label: 'Pod Policy',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.statefulSet?.spec?.podManagementPolicy}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.updateStrategy',
    label: 'Update Strategy',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.statefulSet?.spec?.updateStrategy}
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
            {row.statefulSet &&
              row.statefulSet.metadata &&
              ageCalculator(row.statefulSet.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.currentReplicas',
    label: 'Current',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.statefulSet?.status?.currentReplicas}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.desiredReplicas',
    label: 'Desired',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.statefulSet?.spec?.desiredReplicas}
          </button>
        }
      />
    ),
  },
];

export default KubernetesStatefulSetTable;
