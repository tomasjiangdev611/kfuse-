import ChipWithLabel from 'components/ChipWithLabel';
import React from 'react';
import { RenderCellProps } from '../KubernetesTable';

const KubernetesSubjectsTable = (
  colorsByFunctionName: {
    [key: string]: string;
  },
  entity: any,
) => [
  {
    key: 'name',
    label: 'Name',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{entity?.metadata?.name}</button>}
      />
    ),
  },
  {
    key: 'kind',
    label: 'Kind',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{row?.kind}</button>}
      />
    ),
  },
  {
    key: 'namespace',
    label: 'Namespace',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button>
            {
              entity?.tags
                ?.map((tag) => tag.split(':'))
                .find(([key]) => key === 'kube_namespace')?.[1]
            }
          </button>
        }
      />
    ),
  },
  {
    key: 'apiGroup',
    label: 'Api Group',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{row?.apiGroup}</button>}
      />
    ),
  },
];

export default KubernetesSubjectsTable;
