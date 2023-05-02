import { Loader, Table, TooltipTrigger } from 'components';
import React, { ReactElement, useEffect, useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { SLOProps } from 'types';

import { useSLOAlertsState } from '../hooks';

const columns = (editSLOAlertNewTab: (row: any) => void) => [
  { key: 'title', label: 'Name' },
  {
    key: 'contactPoint',
    label: 'Contact Point',
    renderCell: ({ row }: { row: any }) => {
      if (row.contactPointLabels.length === 0) return 'No Contact Point';
      return (
        <>
          {row.contactPointLabels.map((contact: string) => (
            <span className="chip" key={contact}>
              {contact}
            </span>
          ))}
        </>
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
                editSLOAlertNewTab(row);
              }}
              size={18}
            />
          </TooltipTrigger>
        </div>
      );
    },
  },
];

const SLODetailsAlertsTab = ({
  sloData,
}: {
  sloData: SLOProps;
}): ReactElement => {
  const [sloAlertTable, setSloAlertTable] = useState<any>([]);
  const { isLoading, loadSLOAlerts } = useSLOAlertsState();

  const loadSLOAlertsAndSet = async () => {
    const alertList = await loadSLOAlerts(sloData.alertUids);
    setSloAlertTable(alertList);
  };

  const editSLOAlertNewTab = (row: any): void => {
    const encodeAlertTypeURI = encodeURIComponent(
      JSON.stringify({ value: 'slo' }),
    );
    const sloAlertData = {
      annotations: row.annotations,
      labels: row.labels,
      name: row.title,
      contactPointLabels: row.contactPointLabels,
      group: row.ruleGroup,
      groupFile: 'SLO-Alerts',
      tags: row.tags,
      uid: row.uid,
    };

    const sloAlertDataURI = encodeURIComponent(JSON.stringify(sloAlertData));
    window.open(
      `#/alerts/create?alertType=${encodeAlertTypeURI}&sloAlertData=${sloAlertDataURI}`,
      '_blank',
    );
  };

  useEffect(() => {
    loadSLOAlertsAndSet();
  }, [sloData]);
  return (
    <div className="slo__details__alerts-tab">
      <Loader isLoading={isLoading}>
        <Table
          className="slo__details__alerts-tab__table"
          columns={columns(editSLOAlertNewTab)}
          rows={sloAlertTable}
        />
      </Loader>
    </div>
  );
};

export default SLODetailsAlertsTab;
