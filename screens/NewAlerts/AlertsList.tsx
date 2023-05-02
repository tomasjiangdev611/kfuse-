import colorsByAlertState from 'constants/colorsByAlertState';
import { Loader, Table, TooltipTrigger, usePopoverContext } from 'components';
import { ConfirmationModal, useModalsContext } from 'components/Modals';
import { TimeRangePeriod } from 'composite';
import React, { ReactElement, useMemo, useRef } from 'react';
import { MdDelete, MdModeEdit, MdNotificationsOff } from 'react-icons/md';
import { IoIosWarning } from 'react-icons/io';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { DateSelection } from 'types';

import { useAlertsCreate, useAlertsDelete, useAlertsState } from './hooks';
import { DeleteRuleProps, RuleProps } from './types';
import {
  editLogAlert,
  editMetricAlert,
  editSLOAlert,
  filterAlertsRules,
} from './utils';

const columns = (
  onDeleteAlertsRule: (val: DeleteRuleProps) => void,
  onMuteClick: (rule: RuleProps, muteRef: any) => void,
  navigate: NavigateFunction,
  addToast: (val: { text: string; status: string }) => void,
) => [
  {
    key: 'Status',
    label: 'Status',
    renderCell: ({ row }: { row: any }) => {
      return (
        <div
          className="chip alerts__list__status-chip"
          style={{ backgroundColor: colorsByAlertState[row.status] }}
        >
          {row.status}
        </div>
      );
    },
  },
  {
    key: 'name',
    label: 'Name',
    renderCell: ({ row }: { row: RuleProps }) => {
      return (
        <>
          {row.contactPointLabels.length === 0 && (
            <TooltipTrigger tooltip="Contact points not setup">
              <IoIosWarning />
            </TooltipTrigger>
          )}
          <span className="alerts__list__name">{row.name}</span>
        </>
      );
    },
  },
  {
    key: 'type',
    label: 'Type',
    renderCell: ({ row }: { row: RuleProps }) =>
      row.annotations?.ruleType?.toUpperCase(),
  },
  {
    key: 'tags',
    label: 'Tags',
    renderCell: ({ row }: { row: RuleProps }) => {
      return (
        <div className="alerts__list__tags">
          {row.tags?.map((tag: string) => (
            <div className="chip" key={tag}>
              {tag}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    label: 'Actions',
    key: 'actions',
    renderCell: ({ row }: { row: RuleProps }) => {
      const muteRef = useRef(null);
      return (
        <div className="alerts__contacts__table__actions">
          <TooltipTrigger tooltip={row.mute ? 'Unmute Alert' : 'Mute Alert'}>
            <span ref={muteRef}>
              <MdNotificationsOff
                className="alerts__contacts__table__actions__icon--edit"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMuteClick(row, muteRef);
                }}
                size={18}
                style={row.mute ? { opacity: 0.5 } : { opacity: 1 }}
              />
            </span>
          </TooltipTrigger>
          <TooltipTrigger tooltip="Edit">
            <MdModeEdit
              className="alerts__contacts__table__actions__icon--edit"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (row.ruleData.length < 3) {
                  editSLOAlert(row, navigate);
                  return;
                }

                if (row.annotations?.ruleType === 'metrics') {
                  editMetricAlert(row, navigate, addToast);
                } else if (row.annotations?.ruleType === 'logs') {
                  editLogAlert(row, navigate);
                } else {
                  editMetricAlert(row, navigate, addToast);
                }
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
                onDeleteAlertsRule({
                  folderName: row.groupFile,
                  groupFile: row.group,
                  uid: row.uid,
                  alertType: row.annotations?.alertType
                    ? row.annotations.alertType
                    : '',
                  metricName: row.ruleData[0].model.expr,
                });
              }}
              size={18}
            />
          </TooltipTrigger>
        </div>
      );
    },
  },
];

const AlertsList = ({
  alertsState,
}: {
  alertsState: ReturnType<typeof useAlertsState>;
}): ReactElement => {
  const navigate = useNavigate();
  const modal = useModalsContext();
  const popover = usePopoverContext();
  const { deleteAlertsRule } = useAlertsDelete();
  const alertsCreateState = useAlertsCreate();
  const { addToast } = alertsCreateState;

  const {
    isLoading,
    muteAlert,
    rules,
    reloadAlerts,
    selectedFacetValuesByNameState,
    setAlertsProperties,
    setIsLoading,
    unMuteAlert,
  } = alertsState;

  const onDeleteAlertsRule = (val: DeleteRuleProps) => {
    modal.push(
      <ConfirmationModal
        className="alerts__list__delete-alerts-rule"
        description="Are you sure you want to delete this alert?"
        onCancel={() => modal.pop()}
        onConfirm={() => {
          setIsLoading(true);
          modal.pop();
          deleteAlertsRule(val)
            .then(() => {
              reloadAlerts();
              setIsLoading(false);
            })
            .catch(() => {
              modal.pop();
              setIsLoading(false);
            });
        }}
        title="Delete Alert"
      />,
    );
  };

  const onMuteClick = (rule: RuleProps, muteRef: any) => {
    if (rule.mute) {
      unMuteAlert(rule.mute.muteId).then(() => {
        reloadAlerts();
      });
      return;
    }

    popover.open({
      component: TimeRangePeriod,
      element: muteRef.current,
      popoverPanelClassName: 'alerts__list__mute-popover',
      props: {
        close: () => popover.close(),
        onChange: (val: DateSelection) => {
          muteAlert(rule, val).then(() => {
            reloadAlerts();
          });
        },
        periodType: 'Next',
      },
      right: true,
      width: 160,
    });
  };

  const filteredAlertList = useMemo(() => {
    if (!rules) return [];
    const { formattedRules, status, components, tags } = filterAlertsRules(
      rules,
      selectedFacetValuesByNameState.state,
    );

    setAlertsProperties({ status, components, tags });
    return formattedRules;
  }, [selectedFacetValuesByNameState.state, rules]);

  return (
    <Loader className="alerts__list" isLoading={isLoading}>
      <Table
        className="alerts__list__table"
        columns={columns(onDeleteAlertsRule, onMuteClick, navigate, addToast)}
        rows={filteredAlertList || []}
        onRowClick={({ row }: { row: RuleProps }) => {
          if (row.ruleData.length > 2) {
            navigate(`/alerts/details`, { state: row });
          } else {
            navigate(`/alerts/details/slo`, { state: row });
          }
        }}
      />
    </Loader>
  );
};

export default AlertsList;
