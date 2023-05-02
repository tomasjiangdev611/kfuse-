import { Loader } from 'components';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SLOFormProps, SLOProps } from 'types/SLO';

import { useCreateSLOState, useSLOAlertsState } from '../hooks';
import SLOCreateStatusInfo from './SLOCreateStatusInfo';
import SLOCreateStepper from './SLOCreateStepper';
import { parseSLOPromql } from '../utils';

const SLOCreate = () => {
  const [initDataLoaded, setInitDataLoaded] = useState(true);
  const createSLOState = useCreateSLOState();
  const { loadSLOAlerts } = useSLOAlertsState();
  const {
    createSloRequest,
    denominatorQueryState,
    loadSLOResult,
    numeratorQueryState,
    sloCountThresold,
    setSloCountThresold,
    setFormValue,
    setSloType,
  } = createSLOState;

  const location = useLocation();
  const editSLOData = location.state as SLOProps;

  const loadSLOAlertsAndSetInitData = async () => {
    const [high, low] = await loadSLOAlerts(editSLOData.alertUids);
    const alertsObject: Pick<SLOFormProps, 'high' | 'low'> = {
      high: {
        name: high.title,
        description: high.annotations.description,
        contactPoints: high.contactPointLabels,
        labels: [],
      },
      low: {
        name: low.title,
        description: low.annotations.description,
        contactPoints: low.contactPointLabels,
        labels: [],
      },
    };

    Object.keys(alertsObject).forEach((key) => {
      setFormValue(key, alertsObject[key]);
    });

    const highLabels = high.tags.map((key: string) => ({
      key,
      value: high.labels[key],
    }));
    const lowLabels = low.tags.map((key: string) => ({
      key,
      value: low.labels[key],
    }));
    setFormValue('high.labels', highLabels);
    setFormValue('low.labels', lowLabels);
  };

  useEffect(() => {
    if (editSLOData) {
      const { errorExpr, totalExpr } = editSLOData;
      const errorQueries = parseSLOPromql(errorExpr);
      const totalQueries = parseSLOPromql(totalExpr);

      denominatorQueryState.setQueries(totalQueries.queries);
      denominatorQueryState.setFormulas(totalQueries.formulas);
      denominatorQueryState.callSeriesQuery(0, totalQueries.metricName);

      setInitDataLoaded(false);
      numeratorQueryState.setQueries(errorQueries.queries);
      numeratorQueryState.setFormulas(errorQueries.formulas);
      numeratorQueryState.callSeriesQuery(0, errorQueries.metricName);

      const sloDetails: Omit<SLOFormProps, 'high' | 'low'> = {
        objective: editSLOData.budget,
        sloName: editSLOData.name,
        sloDescription: editSLOData.description,
        sloLabels: Object.keys(editSLOData.labels).map((key) => ({
          key,
          value: editSLOData.labels[key],
        })),
      };

      Object.keys(sloDetails).forEach((key) => {
        setFormValue(key, sloDetails[key]);
      });
      setFormValue('high.labels', []);
      setFormValue('low.labels', []);

      if (totalExpr.includes('span_latency_ms_bucket')) {
        setSloType({ value: 'latency' });
        setSloCountThresold({
          ...sloCountThresold,
          numerator: {
            ...sloCountThresold.numerator,
            threshold: Number(errorQueries.leValue) || 0,
          },
        });
      }
      loadSLOAlertsAndSetInitData();
    }
  }, []);

  useEffect(() => {
    if (!initDataLoaded) {
      loadSLOResult();
      setInitDataLoaded(true);
    }
  }, [numeratorQueryState.formulas]);

  return (
    <div className="slo__create">
      <div className="slo__create__body">
        <Loader isLoading={createSloRequest.isLoading}>
          <SLOCreateStepper createSLOState={createSLOState} />
        </Loader>
        <SLOCreateStatusInfo createSLOState={createSLOState} />
      </div>
    </div>
  );
};

export default SLOCreate;
