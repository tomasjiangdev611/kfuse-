import ChipWithLabel from 'components/ChipWithLabel';
import { ageCalculator } from 'utils/timeNs';
import React from 'react';
import { RenderCellProps } from '../KubernetesTable';

const KubernetesServiceTable = (
  colorsByFunctionName: { [key: string]: string },
  setActiveFunctionNameHandler: (functionName: string) => () => void,
) => [
  {
    key: 'kube_service',
    label: 'Service',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.service?.metadata.name}
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
            {row.service &&
              row.service?.metadata &&
              ageCalculator(row.service.metadata.creationTimestamp)}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.type',
    label: 'Type',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.service?.spec.type}
          </button>
        }
      />
    ),
  },

  {
    key: 'spec.clusterIp',
    label: 'Cluster IP',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.service?.spec.clusterIp}
          </button>
        }
      />
    ),
  },
  {
    key: 'spec.externalIPs',
    label: 'External IPS',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.service?.spec.externalIPs ? row.service.spec.externalIPs : '-'}
          </button>
        }
      />
    ),
  },
  {
    key: 'headerPorts',
    label: 'Ports',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row)}>
            {row.service?.spec?.ports[0]?.name ||
              '' +
                ' ' +
                row.service?.spec?.ports[0]?.port +
                '/' +
                row.service?.spec.ports[0].protocol}
          </button>
        }
      />
    ),
  },
];

export default KubernetesServiceTable;
