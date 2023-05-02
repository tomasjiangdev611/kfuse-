import {
  ConfirmationModal,
  Loader,
  Table,
  TooltipTrigger,
  useModalsContext,
} from 'components';
import React, { ReactElement, useMemo, useState } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { SLOProps } from 'types/SLO';

import { useSLOState } from '../hooks';
import { SLODetails } from '../SLODetails';
import { filterSLOList } from '../utils';

const SLOListColumns = (
  onDeleteSLO: (val: SLOProps) => void,
  onEditSLO: (val: SLOProps) => void,
) => [
  { key: 'name', label: 'Name' },
  {
    key: 'budget',
    label: 'Objective',
    renderCell: ({ row }: { row: SLOProps }) => `${row.budget}%`,
  },
  {
    key: 'status',
    label: 'Status',
    renderCell: ({ row }: { row: SLOProps }) => {
      if (!row.statusErrorBudget) return null;

      return (
        <span style={{ color: row.statusErrorBudget.statusColor }}>
          {row.statusErrorBudget.status}
        </span>
      );
    },
  },
  {
    key: 'errorBudget',
    label: 'Error Budget',
    renderCell: ({ row }: { row: SLOProps }) => {
      if (!row.statusErrorBudget) return null;

      return (
        <span style={{ color: row.statusErrorBudget.errorBudgetColor }}>
          {row.statusErrorBudget.errorBudget}
        </span>
      );
    },
  },
  {
    label: 'Actions',
    key: 'actions',
    renderCell: ({ row }: { row: SLOProps }) => {
      return (
        <div className="alerts__contacts__table__actions">
          <TooltipTrigger tooltip="Edit">
            <MdModeEdit
              className="alerts__contacts__table__actions__icon--edit"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditSLO(row);
              }}
              size={18}
            />
          </TooltipTrigger>
          <TooltipTrigger tooltip="Delete">
            <MdDelete
              className="alerts__contacts__table__actions__icon--delete"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteSLO(row);
              }}
              size={18}
            />
          </TooltipTrigger>
        </div>
      );
    },
  },
];

const SLOList = ({
  sloState,
}: {
  sloState: ReturnType<typeof useSLOState>;
}): ReactElement => {
  const navigate = useNavigate();
  const modal = useModalsContext();

  const [detailsScreen, setDetailsScreen] = useState<SLOProps>(null);
  const {
    deleteSloRequest,
    loadSLOList,
    selectedFacetValuesByNameState,
    sloList,
    sloListRequest,
    setSloFilterProperties,
  } = sloState;

  const onDeleteSLO = (val: SLOProps) => {
    modal.push(
      <ConfirmationModal
        className="alerts__list__delete-alerts-rule"
        description="Are you sure you want to delete this SLO?"
        onCancel={() => modal.pop()}
        onConfirm={() => {
          modal.pop();
          deleteSloRequest.call(val.name).then((res) => {
            loadSLOList();
          });
        }}
        title="Delete SLO"
      />,
    );
  };

  const onEditSLO = (val: SLOProps) => {
    navigate(`/apm/slo/create`, { state: val });
  };

  const filteredSLOList = useMemo(() => {
    if (!sloList) return [];
    const {
      sloList: newSloList,
      status,
      services,
      tags,
    } = filterSLOList(sloList, selectedFacetValuesByNameState.state);

    setSloFilterProperties({ status, service: services, tags });
    return newSloList;
  }, [selectedFacetValuesByNameState.state, sloList]);

  return (
    <div className="slos__list__table">
      <Loader
        isLoading={deleteSloRequest.isLoading || sloListRequest.isLoading}
      >
        <Table
          className="slos__list__table__table"
          columns={SLOListColumns(onDeleteSLO, onEditSLO)}
          rows={filteredSLOList || []}
          onRowClick={({ row }) => setDetailsScreen(row)}
        />
        {detailsScreen && (
          <SLODetails
            close={() => setDetailsScreen(null)}
            sloData={detailsScreen}
            title={detailsScreen.name}
          />
        )}
      </Loader>
    </div>
  );
};

export default SLOList;
