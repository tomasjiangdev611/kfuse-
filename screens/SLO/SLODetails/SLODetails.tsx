import { CopyButton, RightSidebar, Tab, Tabs, useTabs } from 'components';
import classnames from 'classnames';
import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { SLOProps } from 'types/SLO';

import SLODetailsAlertsTab from './SLODetailsAlertsTab';
import SLODetailsObjective from './SLODetailsObjective';
import SLODetailsHistoryChart from './SLODetailsHistoryChart';

type Props = {
  close: VoidFunction;
  sloData: SLOProps;
  title: string;
};

const SLODetails = ({ close, sloData, title }: Props): ReactElement => {
  const tabs = useTabs();
  const navigate = useNavigate();

  const sloLabelArray = Object.keys(sloData.labels).map((key) => ({
    key,
    value: sloData.labels[key],
  }));

  return (
    <RightSidebar className="slo__right-sidebar" close={close} title={title}>
      <div className="slo__right-sidebar__main">
        <Tabs className="tabs--underline" tabs={tabs}>
          <Tab label="Status & History">
            <div className="slos__status__description">
              <div className="slos__status__description__text">
                <div className="slos__query__heading">Description:</div>
                <div>&nbsp; {sloData.description}</div>
              </div>
              <div className="slos__status__edit-slo">
                <button
                  className="button button--blue"
                  onClick={() =>
                    navigate(`/apm/slo/create`, { state: sloData })
                  }
                >
                  Edit SLO
                </button>
              </div>
            </div>
            <div className="slos__query__container">
              <div className="slos__query__heading">QUERY</div>
              <div className="slos__query__box">
                <div className="slos__query__details">{`${sloData.errorExpr} / ${sloData.totalExpr} * 100`}</div>
                <div className="slos__query__copy__button">
                  <CopyButton
                    text={`${sloData.errorExpr} / ${sloData.totalExpr} * 100`}
                  />
                </div>
              </div>{' '}
            </div>
            <div className="slos__query__labels">
              <div className="slos__query__heading">Labels</div>
              <div className="slos__query__labels__chips">
                {sloLabelArray &&
                  sloLabelArray.map((label) => (
                    <div className="chip" key={label.key}>
                      {label.key}:{label.value}
                    </div>
                  ))}
              </div>
            </div>

            <div className="slos__target__box__main__container">
              <div className="slos__target__box__sub__container">
                <div className="slos__target__heading">OBJECTIVE (SLO)</div>
                <div className="slos__status__heading">STATUS</div>
                <div className="slos__error__budget__heading">ERROR BUDGET</div>
              </div>
              {sloData.statusErrorBudget && (
                <SLODetailsObjective
                  days={30}
                  target={sloData.budget}
                  statusErrorBudget={sloData.statusErrorBudget}
                  primary={false}
                />
              )}
            </div>
            <div className="slos__status__history__title">History</div>
            <div className="slos__tabs slos__buttons tabs__buttons--underline">
              <button
                className={classnames({
                  tabs__buttons__item: true,
                  'tabs__buttons__item--active': true,
                })}
              >
                Past 30 Days
              </button>
            </div>
            <div className="slos__good__bad__query__container">
              <div className="slos__good__bad__query__title">
                Good/bad queries
              </div>
            </div>
            {sloData.statusErrorBudget && (
              <SLODetailsHistoryChart sloData={sloData} />
            )}
          </Tab>
          <Tab label="Alerts">
            <SLODetailsAlertsTab sloData={sloData} />
          </Tab>
        </Tabs>
      </div>
    </RightSidebar>
  );
};

export default SLODetails;
