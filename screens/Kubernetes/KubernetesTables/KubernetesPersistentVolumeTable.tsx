import React from 'react';
import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator, calculateCapacity } from 'utils/timeNs';
import colorsByLogLevel from 'constants/colorsByLogLevel';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';

const KubernetesPersistentVolumeTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
) => [
  {
    key: 'kube_persistent_volume',
    label: 'Persistent Volume',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.persistentVolume?.metadata.name}
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
            onClick={filterCluster('Cluster', row.persistentVolume)}
          >
            {
              row.persistentVolume?.tags
                ?.find((element) => {
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
    key: 'status.phase',
    label: 'Phase',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            className="kubernetes__right-sidebar__message__header__status"
            style={{
              backgroundColor:
                colorsByLogLevel[
                  row.persistentVolume?.status?.phase.toLowerCase() === 'bound'
                    ? 'running'
                    : 'error'
                ],
            }}
            onClick={setActiveFunctionNameHandler(row)}
          >
            {row.persistentVolume?.status?.phase}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.storageClassName',
    label: 'Class',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.persistentVolume?.spec?.storageClassName}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.persistentVolumeType',
    label: 'Type',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.persistentVolume?.spec?.persistentVolumeType}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.accessModes',
    label: 'Access Modes',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.persistentVolume?.spec?.accessModes}
          </button>
        }
      />
    ),
  },
  {
    key: 'kube_reclaim_policy',
    label: 'Reclaim Policy',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.persistentVolume?.spec?.persistentVolumeReclaimPolicy}
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
            {row.persistentVolume &&
              row.persistentVolume.metadata &&
              ageCalculator(row.persistentVolume.metadata?.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.capacity',
    label: 'Capacity',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {calculateCapacity(row.persistentVolume?.spec?.capacity?.storage)}
          </button>
        }
      />
    ),
  },
];

export default KubernetesPersistentVolumeTable;
