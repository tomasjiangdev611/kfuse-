import ChipWithLabel from 'components/ChipWithLabel';
import colors from 'constants/colors';
import colorsByLogLevel from 'constants/colorsByLogLevel';
import React from 'react';
import { ageCalculator } from 'utils/timeNs';
import { RenderCellProps } from '../KubernetesTable';

const KubernetesCronJobTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
) => [
  {
    key: 'kube_cron_job',
    label: 'Cron Job',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.cronJob?.metadata?.name}
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
            onClick={filterCluster('Cluster', row.cronJob)}
          >
            {
              row.cronJob?.tags
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
            onClick={filterNamespace('Namespace', row.cronJob)}
          >
            {row.cronJob?.metadata?.namespace}
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
            {row.cronJob &&
              row.cronJob.metadata &&
              ageCalculator(row.cronJob.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.schedule',
    label: 'Schedule',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.cronJob?.spec.schedule}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.suspend',
    label: 'Suspend',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            className="kubernetes__right-sidebar__message__header__status"
            style={{
              backgroundColor:
                colorsByLogLevel[
                  row.cronJob?.spec.suspend === true ? 'error' : 'running'
                ],
            }}
            onClick={setActiveFunctionNameHandler(row)}
          >
            {row.cronJob?.spec.suspend === true ? 'Suspended' : 'Active'}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerActiveJobs',
    label: 'Active Jobs',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.cronJob?.status?.active?.name || 0}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerKubeLabels',
    label: 'Kubernetes Labels',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.cronJob?.metadata?.labels?.map((element) => {
              return element;
            }) || ''}
          </button>
        }
      />
    ),
  },
];

export default KubernetesCronJobTable;
