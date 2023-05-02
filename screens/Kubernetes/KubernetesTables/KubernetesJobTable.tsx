import React from 'react';
import { RenderCellProps } from '../KubernetesTable';
import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator, duration } from 'utils/timeNs';
import colorsByLogLevel from 'constants/colorsByLogLevel';
import colors from 'constants/colors';

const KubernetesJobTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
) => [
  {
    key: 'kube_job',
    label: 'Job',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.job?.metadata?.name}
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
              row.job?.tags
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
            {row.job?.metadata?.namespace}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.active',
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
                  row.job?.status?.active == 1 ||
                  row.job?.status?.succeeded == 1
                    ? 'running'
                    : 'error'
                ],
            }}
            onClick={setActiveFunctionNameHandler(row)}
          >
            {row.job?.status?.active == 1 || row.job?.status?.succeeded == 1
              ? 'Success'
              : 'Failed'}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.completions',
    label: 'Completions',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.job?.spec?.completions}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.parallelism',
    label: 'Parallelism',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.job?.spec?.parallelism}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.backofflimit',
    label: 'Backoff Limit',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.job?.spec?.backoffLimit}
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
            {row.job &&
              row.job.metadata &&
              ageCalculator(row.job.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.completionTime',
    label: 'Duration',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {duration(
              row.job?.status?.startTime,
              row.job?.status?.completionTime,
            )}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.conditionMessage',
    label: 'Kubernetes Labels',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.job?.status?.conditionMessage}
          </button>
        }
      />
    ),
  },
];

export default KubernetesJobTable;
