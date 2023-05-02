import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator, calculateCapacity } from 'utils/timeNs';
import React from 'react';
import colors from 'constants/colors';
import { RenderCellProps } from '../KubernetesTable';
import colorsByLogLevel from 'constants/colorsByLogLevel';

const KubernetesPersistentVolumeClaimTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
  filterCluster: (entity: string, row: any) => () => void,
  filterNamespace: (entity: string, row: any) => () => void,
  filterPersistentVolume: (entity: string, row: any) => () => void,
) => [
  {
    key: 'persistentvolumeclaim',
    label: 'Persistent Volume Claim',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.persistentVolumeClaim?.metadata?.name}
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
            onClick={filterCluster('Cluster', row.persistentVolumeClaim)}
          >
            {
              row.persistentVolumeClaim?.tags
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
            onClick={filterNamespace('Namespace', row.persistentVolumeClaim)}
          >
            {row.persistentVolumeClaim?.metadata?.namespace}
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
            {row.persistentVolumeClaim?.spec?.storageClassName}
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
                  row.persistentVolumeClaim?.status.phase.toLowerCase() ===
                  'bound'
                    ? 'running'
                    : 'error'
                ],
            }}
            onClick={setActiveFunctionNameHandler(row)}
          >
            {row.persistentVolumeClaim?.status?.phase}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.volumeName',
    label: 'Persistent Volume',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button
            style={{ color: colors.blue }}
            onClick={filterPersistentVolume(
              'PersistentVolume',
              row.persistentVolumeClaim,
            )}
          >
            {row.persistentVolumeClaim?.spec?.volumeName}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerAccessModes',
    label: 'Desired Access Modes',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.persistentVolumeClaim?.spec?.accessModes.map((element) => {
              return element;
            })}
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
            {row.persistentVolumeClaim &&
              row.persistentVolumeClaim.metadata &&
              ageCalculator(
                row.persistentVolumeClaim.metadata?.creationTimestamp,
              )}
          </button>
        }
      />
    ),
  },
  {
    key: 'status.capacity',
    label: 'Capacity Requests',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {calculateCapacity(
              row.persistentVolumeClaim?.status?.capacity?.storage,
            )}
          </button>
        }
      />
    ),
  },
  {
    key: 'capacity',
    label: 'Capacity',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {calculateCapacity(
              row.persistentVolumeClaim?.status?.capacity?.storage,
            )}
          </button>
        }
      />
    ),
  },
];

export default KubernetesPersistentVolumeClaimTable;
