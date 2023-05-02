import { colorsByAlertState } from 'constants';
import {
  ConfirmationModal,
  Loader,
  useModalsContext,
  usePopoverContext,
} from 'components';
import { TimeRangePeriod } from 'composite';
import React, { ReactElement, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOperatorSign } from 'utils';
import { DateSelection } from 'types';

import { useAlertsCreate, useAlertsDelete, useAlertsState } from '../hooks';
import { ConditionProps, RuleProps } from '../types';
import { editLogAlert, editMetricAlert, editSLOAlert } from '../utils';

const AlertsDetailsProperties = ({
  alertsState,
  condition,
  promql,
  properties,
  status,
}: {
  alertsState: ReturnType<typeof useAlertsState>;
  condition: ConditionProps;
  promql: string;
  properties: RuleProps;
  status: string;
}): ReactElement => {
  const [rule, setRule] = useState<RuleProps>(properties);
  const modal = useModalsContext();
  const navigate = useNavigate();
  const muteRef = useRef(null);
  const popover = usePopoverContext();
  const { deleteAlertsRule } = useAlertsDelete();
  const alertsCreateState = useAlertsCreate();
  const { addToast } = alertsCreateState;
  const annotations = rule.annotations || {};
  const labels = Object.keys(rule.labels || {});
  const { isLoading, muteAlert, setIsLoading, unMuteAlert } = alertsState;

  const goToEditAlert = () => {
    if (properties.ruleData.length < 3) {
      editSLOAlert(rule, navigate);
      return;
    }
    if (rule.annotations?.ruleType === 'metrics') {
      editMetricAlert(rule, navigate, addToast);
    } else if (rule.annotations?.ruleType === 'logs') {
      editLogAlert(rule, navigate);
    } else {
      editMetricAlert(rule, navigate, addToast);
    }
  };

  const onDeleteAlertsRule = () => {
    modal.push(
      <ConfirmationModal
        className="alerts__list__delete-alerts-rule"
        description="Are you sure you want to delete this alert?"
        onCancel={() => modal.pop()}
        onConfirm={() => {
          setIsLoading(true);
          deleteAlertsRule({
            folderName: rule.groupFile,
            groupFile: rule.group,
            uid: rule.uid,
            alertType: rule.annotations?.alertType
              ? rule.annotations.alertType
              : '',
            metricName: rule.name,
          })
            .then(() => {
              navigate('/alerts');
              modal.pop();
              setIsLoading(false);
            })
            .catch(() => {
              setIsLoading(false);
            });
        }}
        title="Delete Alert"
      />,
    );
  };

  const onMuteClick = (rule: RuleProps, muteRef: any) => {
    if (rule.mute) {
      unMuteAlert(rule.mute.muteId)
        .then(() => {
          setRule({ ...rule, mute: null });
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
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
          muteAlert(rule, val)
            .then((res: { id: string }) => {
              setRule({ ...rule, mute: { muteId: res.id, status: true } });
              setIsLoading(false);
            })
            .then(() => {
              setIsLoading(false);
            });
        },
        periodType: 'Next',
      },
      right: true,
      width: 160,
    });
  };

  return (
    <div>
      <Loader isLoading={isLoading}>
        <div className="alerts__details__properties__header">
          <h1>{rule.name}</h1>
          <div className="alerts__details__properties__actions">
            <button className="button" onClick={() => navigate('/alerts')}>
              Close
            </button>
            <button
              className="button button--blue"
              onClick={() => onMuteClick(rule, muteRef)}
              ref={muteRef}
            >
              {rule.mute ? 'Unmute' : 'Mute'}
            </button>

            <button
              className="button button--blue"
              onClick={() => goToEditAlert()}
            >
              Edit
            </button>
            <button
              className="button button--red"
              onClick={() => onDeleteAlertsRule()}
            >
              Delete
            </button>
          </div>
        </div>
      </Loader>
      <div className="alerts__details__properties__summary box-shadow">
        <div className="alerts__details__subheader">
          <h2>Properties</h2>
          <div
            className="chip alerts__list__status-chip"
            style={{ backgroundColor: colorsByAlertState[status] }}
          >
            {status}
          </div>
        </div>
        {rule && (
          <>
            <div className="alerts__details__properties__summary__item">
              <b>Query</b>{' '}
              <div className="code-container">
                <pre className="code-preview">
                  {promql}{' '}
                  <b>
                    {getOperatorSign(condition.of)} {condition.value}
                  </b>
                </pre>
              </div>
            </div>
          </>
        )}
        {rule && (
          <div className="alerts__details__properties__summary__item">
            <b>Evaluate:</b> every <b>{rule.evaluate.every}</b> for{' '}
            <b>{rule.evaluate.for}</b>
          </div>
        )}
        {labels.length > 0 && (
          <div className="alerts__details__properties__summary__item">
            <b>Contact Points:</b>{' '}
            {labels.map((label) => {
              return (
                <span className="chip" key={label}>
                  {label}
                </span>
              );
            })}
          </div>
        )}
        <div className="alerts__details__properties__summary__item">
          <b>Title:</b> {annotations.summary}
        </div>
        <div className="alerts__details__properties__summary__item">
          <b>Description:</b> {annotations.description}
        </div>
      </div>
    </div>
  );
};

export default AlertsDetailsProperties;
