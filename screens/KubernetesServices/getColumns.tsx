import {
  ChipWithLabel,
  TableColumnType,
  TooltipTrigger,
  ToggleSwitch,
} from 'components';
import { kubernetesServicesTableKpis } from 'constants';
import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { DateSelection, Service } from 'types';
import { KpisByServiceName } from './types';

type RenderCellProps = {
  row: Service;
  value: any;
};

const getColumns = ({
  colorsByServiceName,
  date,
  kpisByServiceName,
  dashboardUid,
}: {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  kpisByServiceName: KpisByServiceName;
  dashboardUid: string;
}) => [
  {
    key: 'name',
    label: 'Name',
    renderCell: ({ row }: RenderCellProps) => {
      const filterParams = decodeURIComponent(
        JSON.stringify({ service: row.name }),
      );

      return (
        <ChipWithLabel
          color={colorsByServiceName[row.name]}
          label={
            <a
              className="link text--weight-medium"
              href={`#/metrics/dashboard/${dashboardUid}?templateValues=${filterParams}`}
              target="_blank"
              rel="noreferrer"
            >
              {row.name}
            </a>
          }
        />
      );
    },
  },
  {
    key: 'advanceMonitoring',
    label: (
      <span className="flex">
        Advance Monitoring{' '}
        <TooltipTrigger
          tooltip={
            <span>
              <div className="text--align-center">
                Enable monitoring for anomalous
              </div>
              <div className="text--align-center">
                behavior using{' '}
                <a
                  className="link"
                  href="https://kloudfuse.atlassian.net/wiki/spaces/EX/pages/756056089/Advanced+analytics?src=search#HawkEye"
                  rel="noreferrer"
                  target="_blank"
                >
                  Hawkeye
                </a>
              </div>
            </span>
          }
        >
          <FaInfoCircle size={14} />
        </TooltipTrigger>
      </span>
    ),
    renderCell: () => (
      <ToggleSwitch className="toggle-switch--disabled" value />
    ),
  },
  ...kubernetesServicesTableKpis.map((kpi) => ({
    type: TableColumnType.NUMBER,
    key: kpi.key,
    label: kpi.label,
    renderCell: (args) =>
      args.value === undefined || isNaN(args.value)
        ? '-'
        : kpi.renderCell(args),
    value: ({ row }) =>
      kpisByServiceName[row.name] &&
      typeof kpisByServiceName[row.name][kpi.key] === 'number'
        ? kpisByServiceName[row.name][kpi.key]
        : undefined,
  })),
];

export default getColumns;
