import { yupResolver } from '@hookform/resolvers/yup';
import { useToastmasterContext } from 'components';
import {
  useDateState,
  useMetricsQueryStateV2,
  useRequest,
  useUrlState,
} from 'hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  createSlo,
  getGrafanaAlertManager,
  promqlSeries,
  promqlQuery,
} from 'requests';
import { getDateFromRange } from 'screens/Dashboard/utils';
import { ExplorerQueryProps, SLOFormProps } from 'types';
import { getMetricsExplorerDefaultQuery } from 'utils';

import { SLOCountValueThreshold } from '../types';
import {
  buildSLOPromql,
  getAlertsDetailForCreateSLO,
  getFilteredSeriesList,
  sloCreateInputSchema,
} from '../utils';

const setPredefinedMetrics = (setMetrics: any) => {
  const sloMetricList = [
    { label: 'span_errors_total', value: 'span_errors_total' },
    { label: 'span_latency_ms_bucket', value: 'span_latency_ms_bucket' },
    { label: 'spans_total', value: 'spans_total' },
  ];

  setMetrics(sloMetricList);
};

const removeByDefaultAggregation = (query: ExplorerQueryProps) => {
  const newQuery = { ...query };
  newQuery.functions = [];
  return newQuery;
};

const getDefaultSLOQueries = () => {
  const newQuery = getMetricsExplorerDefaultQuery('');
  newQuery.functions = [];
  newQuery.series = ['=""'];
  return [newQuery];
};

const useCreateSLOState = () => {
  const navigate = useNavigate();
  const { addToast } = useToastmasterContext();
  const [date, setDate] = useDateState(getDateFromRange('now-1h', 'now'));

  const [sloCountThresold, setSloCountThresold] = useState<{
    denominator: SLOCountValueThreshold;
    numerator: SLOCountValueThreshold;
  }>({
    denominator: { count: 'count', operator: '>', threshold: '' },
    numerator: { count: 'count', operator: '>', threshold: '' },
  });

  const [sloResult, setSloResult] = useState<[]>(null);
  const [sloType, setSloType] = useUrlState('sloType', {
    value: 'availability',
  });

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SLOFormProps>({
    resolver: yupResolver(sloCreateInputSchema()),
    defaultValues: {
      sloName: '',
      sloDescription: '',
      sloLabels: [{ key: '', value: '' }],
      objective: undefined,
      high: {
        labels: [{ key: '', value: '' }],
        contactPoints: [],
      },
      low: {
        labels: [{ key: '', value: '' }],
        contactPoints: [],
      },
    },
  });

  const createSloRequest = useRequest(createSlo);
  const promqlSeriesRequest = useRequest(promqlSeries);
  const promqlQueryRequest = useRequest(promqlQuery);
  const requestsGrafanaAlertManager = useRequest(getGrafanaAlertManager);

  const loadMetricSeries = async (metricName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      promqlSeriesRequest
        .call({ date, metric: metricName })
        .then((seriesResponse: { status: string; data: Array<any> }) => {
          if (seriesResponse && seriesResponse.status === 'success') {
            const seriesOptions = getFilteredSeriesList(seriesResponse.data);
            resolve(seriesOptions);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  };

  const checkDuplicateServiceAndRemove = (
    queries: ExplorerQueryProps[],
    type: 'numerator' | 'denominator',
  ) => {
    let isDuplicateService = false;
    const newQueries = queries.map((query: ExplorerQueryProps) => {
      const newQuery = { ...query };
      const duplicateIndexs: number[] = [];
      newQuery.series.forEach((series: string, idx) => {
        if (series.startsWith('service_name=')) {
          duplicateIndexs.push(idx);
        }
      });

      if (duplicateIndexs.length > 1) {
        isDuplicateService = true;
        duplicateIndexs.map((idx: number, index) => {
          if (index > 0) {
            newQuery.series.splice(idx, 1);
          }
        });
      }
      return newQuery;
    });

    if (isDuplicateService) {
      addToast({ status: 'error', text: `Duplicate service cannot be added.` });

      if (type === 'numerator') {
        numeratorQueryState.setQueries(newQueries);
      }
      if (type === 'denominator') {
        denominatorQueryState.setQueries(newQueries);
      }
    }
    return isDuplicateService;
  };

  const loadSLOResult = async () => {
    if (
      checkDuplicateServiceAndRemove(numeratorQueryState.queries, 'numerator')
    ) {
      return;
    }
    if (
      checkDuplicateServiceAndRemove(
        denominatorQueryState.queries,
        'denominator',
      )
    ) {
      return;
    }

    const { badEventsPromql, goodEventsPromql, service } = buildSLOPromql({
      denoQueryState: {
        formulas: denominatorQueryState.formulas,
        queries: denominatorQueryState.queries,
      },
      numeQueryState: {
        formulas: numeratorQueryState.formulas,
        queries: numeratorQueryState.queries,
      },
      options: {
        nume: sloCountThresold.numerator,
        deno: sloCountThresold.denominator,
      },
      useType: 'load',
    });

    if (!service || !badEventsPromql || !goodEventsPromql) {
      return;
    }

    const dataset = await Promise.all([
      promqlQueryRequest.call({
        date,
        promqlQueries: [badEventsPromql, goodEventsPromql],
      }),
    ]);

    setSloResult(dataset[0]);
  };

  const numeratorQueryState = useMetricsQueryStateV2({
    activeQueryType: 'single',
    date,
    defaultQueries: getDefaultSLOQueries(),
    onAPICall: loadSLOResult,
    preAddQuery: removeByDefaultAggregation,
    preLoadMetricList: setPredefinedMetrics,
    preLoadMetricSeries: loadMetricSeries,
  });
  const denominatorQueryState = useMetricsQueryStateV2({
    activeQueryType: 'single',
    date,
    defaultQueries: getDefaultSLOQueries(),
    onAPICall: loadSLOResult,
    preAddQuery: removeByDefaultAggregation,
    preLoadMetricList: setPredefinedMetrics,
    preLoadMetricSeries: loadMetricSeries,
  });

  const createSLO = (data: SLOFormProps) => {
    const firstMetricName = numeratorQueryState.queries[0].metric || '';

    if (!firstMetricName) {
      addToast({ text: 'Please select a metric', status: 'error' });
      return;
    }

    const { badEventsPromql, goodEventsPromql, service } = buildSLOPromql({
      denoQueryState: {
        formulas: denominatorQueryState.formulas,
        queries: denominatorQueryState.queries,
      },
      numeQueryState: {
        formulas: numeratorQueryState.formulas,
        queries: numeratorQueryState.queries,
      },
      options: {
        nume: sloCountThresold.numerator,
        deno: sloCountThresold.denominator,
      },
      useType: 'create',
    });

    if (!service) {
      addToast({ text: 'Please select a service', status: 'error' });
      return;
    }

    if (!badEventsPromql) {
      addToast({ text: 'Please enter thresold', status: 'error' });
      return;
    }

    const sloDenoPromqlSanitized = goodEventsPromql
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'");

    const sloNumPromqlSanitized = badEventsPromql
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'");

    const { high, low, objective, sloDescription, sloLabels, sloName } = data;
    const newSloLabels: Array<{ Name: string; Value: string }> = [];
    sloLabels.forEach((label) => {
      if (label.key && label.value)
        newSloLabels.push({ Name: label.key, Value: label.value });
    });

    const { pageAlertInput, ticketAlertInput } = getAlertsDetailForCreateSLO({
      high,
      low,
    });
    const payload = {
      errorQuery: sloNumPromqlSanitized,
      objective: objective,
      pageAlertInput,
      sloDescription,
      sloLabels: newSloLabels,
      sloName,
      sloService: service,
      ticketAlertInput,
      totalQuery: sloDenoPromqlSanitized,
    };

    createSloRequest.call(payload).then((response: any) => {
      if (response) {
        addToast({ text: 'SLO created successfully', status: 'success' });
        navigate('/apm/slo');
      } else {
        addToast({ text: 'Failed to create SLO', status: 'error' });
      }
    });
  };

  useEffect(() => {
    loadSLOResult();
  }, [sloCountThresold]);

  useEffect(() => {
    if (sloType.value === 'availability') {
      const newQueriesNume = [...numeratorQueryState.queries];
      newQueriesNume[0].metric = 'span_errors_total';
      numeratorQueryState.setQueries(newQueriesNume);
      numeratorQueryState.callSeriesQuery(0, 'span_errors_total');

      const newQueriesDeno = [...denominatorQueryState.queries];
      newQueriesDeno[0].metric = 'spans_total';
      denominatorQueryState.setQueries(newQueriesDeno);
      denominatorQueryState.callSeriesQuery(0, 'spans_total');
    } else {
      const newQueriesNume = [...numeratorQueryState.queries];
      newQueriesNume[0].metric = 'span_latency_ms_bucket';
      numeratorQueryState.setQueries(newQueriesNume);
      numeratorQueryState.callSeriesQuery(0, 'span_latency_ms_bucket');

      const newQueriesDeno = [...denominatorQueryState.queries];
      newQueriesDeno[0].metric = 'span_latency_ms_bucket';
      denominatorQueryState.setQueries(newQueriesDeno);
      denominatorQueryState.callSeriesQuery(0, 'span_latency_ms_bucket');
    }
  }, [sloType]);

  useEffect(() => {
    requestsGrafanaAlertManager.call('contact-list');
  }, []);

  return {
    control,
    createSLO,
    createSloRequest,
    denominatorQueryState,
    date,
    handleSubmit,
    loadSLOResult,
    numeratorQueryState,
    requestsGrafanaAlertManager,
    registerSLOInput: register,
    setDate,
    sloCountThresold,
    sloFormError: errors,
    sloResult,
    sloType,
    setFormValue: setValue,
    getFormValue: getValues,
    setSloCountThresold,
    setSloType,
  };
};

export default useCreateSLOState;
