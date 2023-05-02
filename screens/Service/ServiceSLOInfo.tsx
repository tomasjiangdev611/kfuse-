import { PopoverPosition, PopoverTriggerV2, TooltipTrigger } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import { FiTarget } from 'react-icons/fi';
import { getSloStatusByService } from 'requests';
import { SLOProps } from 'types/SLO';
import { getMetricsExplorerDefaultQuery } from 'utils/index';

import { SLODetails } from '../SLO/SLODetails';

const CreateNewSLOPopover = ({
  createAvailabilitySLO,
  createLatencySLO,
  close,
}: {
  createAvailabilitySLO: () => void;
  createLatencySLO: () => void;
  close: () => void;
}) => {
  return (
    <div>
      <div
        className="service__slo-info__create__button"
        onClick={() => {
          createAvailabilitySLO();
          close();
        }}
      >
        Add New Availability SLO
      </div>
      <div
        className="service__slo-info__create__button"
        onClick={() => {
          createLatencySLO();
          close();
        }}
      >
        Add New Latency SLO
      </div>
    </div>
  );
};

const ServiceSLOList = ({
  onClick,
  serviceName,
  sloStatus,
}: {
  onClick: (val: SLOProps) => void;
  serviceName: string;
  sloStatus: { ok: SLOProps[]; breached: SLOProps[] };
}) => {
  const { ok, breached } = sloStatus;
  if (ok.length === 0 && breached.length === 0) {
    return null;
  }

  const sloList = [...ok, ...breached];

  return (
    <div className="service__header__left__slo-list">
      {sloList.map((slo) => {
        return (
          <div
            className="service__header__left__slo-list__item"
            key={slo.name}
            onClick={() => onClick(slo)}
          >
            <div
              className="service__header__left__slo-list__item__status-sign"
              style={{
                backgroundColor: slo.statusErrorBudget.statusColor,
              }}
            ></div>
            <div>
              <div className="service__header__left__slo-list__item__name">
                {slo.name}
              </div>
              <div className="service__header__left__slo-list__item__status">
                Status:&nbsp;
                <span style={{ color: slo.statusErrorBudget.statusColor }}>
                  <b>{slo.statusErrorBudget.status} </b>
                </span>{' '}
                of &nbsp;<b>{slo.budget}%</b>
              </div>
              <div className="service__header__left__slo-list__item__status__error-budget">
                Error Budget Remaining:{' '}
                <span style={{ color: slo.statusErrorBudget.errorBudgetColor }}>
                  <b>{slo.statusErrorBudget.errorBudget}</b>
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div
        className="service__header__left__slo-list__button"
        onClick={() => {
          const filterURI = encodeURI(
            `selectedFacetValuesByName={"Service":{"${serviceName}":1}}`,
          );
          window.open(`#/apm/slo?${filterURI}`, '_blank');
        }}
      >
        View all SLOs&nbsp;
      </div>
    </div>
  );
};

const ServiceSLOInfo = ({ serviceName }: { serviceName: string }) => {
  const [activeSLO, setActiveSLO] = useState<SLOProps>(null);
  const sloStatusRequest = useRequest(getSloStatusByService);

  const createAvailabilitySLO = () => {
    const queryNume = getMetricsExplorerDefaultQuery('span_errors_total');
    queryNume.series[0] = `service_name="${serviceName}"`;
    queryNume.functions = [];

    const numeURI = encodeURIComponent(JSON.stringify([queryNume]));
    const sloTypeURI = encodeURIComponent(
      JSON.stringify({ value: 'availability' }),
    );
    window.open(
      `#/apm/slo/create?metricsQueries=${numeURI}&sloType=${sloTypeURI}`,
      '_blank',
    );
  };

  const createLatencySLO = () => {
    const queryNume = getMetricsExplorerDefaultQuery('span_latency_ms_bucket');
    queryNume.series[0] = `service_name="${serviceName}"`;
    queryNume.functions = [];

    const numeURI = encodeURIComponent(JSON.stringify([queryNume]));
    const sloTypeURI = encodeURIComponent(JSON.stringify({ value: 'latency' }));
    window.open(
      `#/apm/slo/create?metricsQueries=${numeURI}&sloType=${sloTypeURI}`,
      '_blank',
    );
  };

  useEffect(() => {
    sloStatusRequest.call(serviceName);
  }, [serviceName]);

  return (
    <div className="service__header__left__slo-info">
      <div
        className="service__header__left__slo-info__title-icon"
        style={{
          color:
            sloStatusRequest.result &&
            sloStatusRequest.result.breached.length !== 0
              ? 'red'
              : 'green',
        }}
      >
        <FiTarget />
      </div>
      <PopoverTriggerV2
        className="service__slo-info__create__popover"
        popover={({ close }) => (
          <ServiceSLOList
            onClick={(val) => {
              setActiveSLO(val);
              close();
            }}
            serviceName={serviceName}
            sloStatus={sloStatusRequest.result}
          />
        )}
        offsetX={-26}
        position={PopoverPosition.BOTTOM_LEFT}
      >
        <div className="service__header__left__slo-info__title">
          <div>
            {sloStatusRequest.result &&
            sloStatusRequest.result.ok.length === 0 &&
            sloStatusRequest.result.breached.length === 0
              ? 'No SLO'
              : 'SLO'}
          </div>
          <div className="service__header__left__slo-info__main">
            {sloStatusRequest.result &&
              sloStatusRequest.result.ok.length !== 0 && (
                <div className="service__header__left__slo-info__title__ok">
                  {sloStatusRequest.result.ok.length} OK
                </div>
              )}
            {sloStatusRequest.result &&
              sloStatusRequest.result.breached.length !== 0 && (
                <div className="service__header__left__slo-info__title__breached">
                  {sloStatusRequest.result.breached.length} BREACHED
                </div>
              )}
          </div>
        </div>
      </PopoverTriggerV2>
      <div className="service__header__left__slo-info__create">
        <PopoverTriggerV2
          className="service__slo-info__create__popover"
          popover={({ close }) => (
            <CreateNewSLOPopover
              createAvailabilitySLO={createAvailabilitySLO}
              createLatencySLO={createLatencySLO}
              close={close}
            />
          )}
          position={PopoverPosition.BOTTOM_LEFT}
          offsetX={28}
        >
          <TooltipTrigger tooltip="Create new SLO">
            <Plus className="service__header__left__slo-info__create__icon" />
          </TooltipTrigger>
        </PopoverTriggerV2>
      </div>
      {activeSLO && (
        <SLODetails
          close={() => setActiveSLO(null)}
          sloData={activeSLO}
          title={activeSLO.name}
        />
      )}
    </div>
  );
};

export default ServiceSLOInfo;
