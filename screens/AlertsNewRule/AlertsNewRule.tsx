import { Checkbox, Input, Textarea, useToastmasterContext } from 'components';
import { useForm, useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAlertRule, getDatasources, promqlMetadata } from 'requests';
import { defaultMetric } from 'types';
import AlertsNewRuleConditions from './AlertsNewRuleConditions';
import { defaultCondition, defaultLabel } from './constants';
import MetricsPicker from '../MetricsPicker';

const AlertsNewRule = () => {
  const form = useForm({
    conditions: [defaultCondition],
    evaluateInterval: '1m',
    evaluateLength: '5m',
    formula: '',
    labels: [defaultLabel],
    metrics: [defaultMetric],
    rules: [],
  });
  const {
    addArrayItemByKey,
    arrayItemPropsByKey,
    onChange,
    propsByKey,
    values,
  } = form;

  const navigate = useNavigate();

  const createAlertRuleRequest = useRequest(createAlertRule);
  const getDatasourcesRequest = useRequest(getDatasources);
  const promqlMetadataRequest = useRequest(promqlMetadata);

  const { addToast } = useToastmasterContext();

  const addLabel = () => {
    addArrayItemByKey('labels', { ...defaultLabel });
  };

  const submit = () => {
    const onError = (error) => {
      addToast({
        status: 'error',
        text: `Failed to save alert: ${error}`,
      });
    };

    const onSuccess = () => {
      navigate('/alerts');
      addToast({
        status: 'success',
        text: 'Alert "${name}" saved successfully',
      });
    };

    createAlertRuleRequest.call(values).then(onSuccess, onError);
  };

  useEffect(() => {
    getDatasourcesRequest.call().then((datasourceUid) => {
      onChange('datasourceUid', datasourceUid);
    });
    promqlMetadataRequest.call();
  }, []);

  return (
    <div className="alerts-new-rule">
      <div className="alerts-new-rule__section">
        <div className="alerts-new-rule__section__number">1</div>
        <div className="alerts-new-rule__section__main">
          <div className="alerts-new-rule__section__header">Basic Details</div>
          <div className="alerts-new-rule__section__body">
            <div className="alerts-new-rule__section__field">
              <div className="alerts-new-rule__section__field__label">
                Alert Name
              </div>
              <Input type="text" {...propsByKey('name')} />
            </div>
          </div>
        </div>
      </div>
      <div className="alerts-new-rule__section">
        <div className="alerts-new-rule__section__number">2</div>
        <div className="alerts-new-rule__section__main">
          <div className="alerts-new-rule__section__header">Queries</div>
          <div className="alerts-new-rule__section__body">
            <MetricsPicker
              formulaInput={propsByKey('formula')}
              metricsInput={propsByKey('metrics')}
              metrics={promqlMetadataRequest.result || []}
            />
          </div>
        </div>
      </div>
      <div className="alerts-new-rule__section">
        <div className="alerts-new-rule__section__number">3</div>
        <div className="alerts-new-rule__section__main">
          <div className="alerts-new-rule__section__header">Conditions</div>
          <div className="alerts-new-rule__section__body">
            <AlertsNewRuleConditions
              metricsCount={values.metrics.length}
              {...propsByKey('conditions')}
            />
            <div className="alerts-new-rule__section__field">
              <div className="alerts-new-rule__evaluate">
                <div className="alerts-new-rule__evaluate__label">
                  Evaluate every
                </div>
                <div className="alerts-new-rule__evaluate__input">
                  <Input type="text" {...propsByKey('evaluateInterval')} />
                </div>
                <div className="alerts-new-rule__evaluate__label">For</div>
                <div className="alerts-new-rule__evaluate__input">
                  <Input type="text" {...propsByKey('evaluateLength')} />
                </div>
              </div>
            </div>
            <div className="alerts-new-rule__section__field">
              <Checkbox {...propsByKey('shouldNotifyIfDataIsEmpty')} />
              Notify if data is missing
            </div>
          </div>
        </div>
      </div>
      <div className="alerts-new-rule__section">
        <div className="alerts-new-rule__section__number">4</div>
        <div className="alerts-new-rule__section__main">
          <div className="alerts-new-rule__section__header">Metadata</div>
          <div className="alerts-new-rule__section__body">
            <div className="alerts-new-rule__section__field">
              <div className="alerts-new-rule__section__field__label">
                Summary
              </div>
              <div className="alerts-new-rule__section__field__input">
                <Textarea {...propsByKey('description')} />
              </div>
            </div>
            <div className="alerts-new-rule__section__field">
              <div className="alerts-new-rule__section__field__label">
                Labels
              </div>
              <div className="alerts-new-rule__section__field__input">
                <div className="alerts-new-rule__labels">
                  {values.labels.map((label, i) => {
                    const propsByKeyForLabels = arrayItemPropsByKey(
                      'labels',
                      i,
                    );
                    return (
                      <div className="alerts-new-rule__label" key={i}>
                        <div className="alerts-new-rule__label__input">
                          <Input
                            placeholder="Key"
                            type="text"
                            {...propsByKeyForLabels('key')}
                          />
                        </div>
                        <div className="alerts-new-rule__label__equals">=</div>
                        <div className="alerts-new-rule__label__input">
                          <Input
                            placeholder="Value"
                            type="text"
                            {...propsByKeyForLabels('value')}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <button
                    className="alerts-new-rule__labels__button button"
                    onClick={addLabel}
                  >
                    Add Label
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="alerts-new-rule__footer">
        <button className="button button--primary" onClick={submit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AlertsNewRule;
