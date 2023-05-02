import ChipWithLabel from 'components/ChipWithLabel';
import React from 'react';
import { RenderCellProps } from '../KubernetesTable';

const KubernetesRulesTable = (
  colorsByFunctionName: {
    [key: string]: string;
  },
  entity: any,
) => [
  {
    key: 'allVerbs',
    label: 'All Verbs(*)',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{''}</button>}
      />
    ),
  },
  {
    key: 'get',
    label: 'Get',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{row?.verbs.includes('get') ? 'true' : 'false'}</button>}
      />
    ),
  },
  {
    key: 'list',
    label: 'List',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button>{row?.verbs.includes('list') ? 'true' : 'false'}</button>
        }
      />
    ),
  },
  {
    key: 'watch',
    label: 'Watch',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button>{row?.verbs.includes('watch') ? 'true' : 'false'}</button>
        }
      />
    ),
  },
  {
    key: 'create',
    label: 'Create',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button>{row?.verbs.includes('create') ? 'true' : 'false'}</button>
        }
      />
    ),
  },
  {
    key: 'update',
    label: 'Update',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button>{row?.verbs.includes('update') ? 'true' : 'false'}</button>
        }
      />
    ),
  },
  {
    key: 'patch',
    label: 'Patch',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button>{row?.verbs.includes('patch') ? 'true' : 'false'}</button>
        }
      />
    ),
  },
  {
    key: 'delete',
    label: 'Delete',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button>{row?.verbs.includes('delete') ? 'true' : 'false'}</button>
        }
      />
    ),
  },
  {
    key: 'use',
    label: 'Use',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{row?.verbs.includes('use') ? 'true' : 'false'}</button>}
      />
    ),
  },
  {
    key: 'resources',
    label: 'Resources',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{row?.resources ? row?.resources : ''}</button>}
      />
    ),
  },
  {
    key: 'resourceNames',
    label: 'Resource Names',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{row?.resourceNames ? row?.resourceNames : ''}</button>}
      />
    ),
  },
  {
    key: 'apiGroups',
    label: 'Api Groups',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={<button>{row?.apiGroups ? row?.apiGroups : ''}</button>}
      />
    ),
  },
];

export default KubernetesRulesTable;
