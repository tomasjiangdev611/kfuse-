import classnames from 'classnames';
import { ChipWithLabel, Loader } from 'components';
import {
  colorsByLogLevel,
  CoreLabels,
  CoreLabelsBitmap,
  CoreLevelLabel,
  CoreSourceLabel,
  CloudLabelsBitmap,
  KubernetesLabelsBitmap,
} from 'constants';
import { useRequest, useToggle } from 'hooks';
import React, { ReactElement, useEffect, useMemo } from 'react';
import { HiOutlineServer } from 'react-icons/hi';
import { MdOutlineLabel } from 'react-icons/md';
import { getLabelNames, getLabelValues, logSources } from 'requests';
import { useLogsState, useQueryScheduler } from './hooks';
import LogsFacetGroup from './LogsFacetGroup';
import LogsFacetGroupFacet from './LogsFacetGroupFacet';

const groupLabels = (getlabelNamesResult: string[]) => {
  const additionalLabels = [];
  const cloudLabels = [];
  const kubernetesLabels = [];

  getlabelNamesResult.sort().forEach((labelName) => {
    if (CloudLabelsBitmap[labelName]) {
      cloudLabels.push(CloudLabelsBitmap[labelName]);
    } else if (KubernetesLabelsBitmap[labelName]) {
      kubernetesLabels.push(KubernetesLabelsBitmap[labelName]);
    } else if (!CoreLabelsBitmap[labelName]) {
      additionalLabels.push({
        component: 'Additional',
        name: labelName,
        type: 'string',
      });
    }
  });

  return {
    additionalLabels,
    cloudLabels,
    kubernetesLabels,
  };
};

const LogsSidebar = ({
  logsState,
  queryScheduler,
}: {
  logsState: ReturnType<typeof useLogsState>;
  queryScheduler: ReturnType<typeof useQueryScheduler>;
}): ReactElement => {
  const getLabelNamesRequest = useRequest(getLabelNames);
  const logSourcesRequest = useRequest(logSources);

  const {
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
    setLabels,
  } = logsState;
  const components = logSourcesRequest.result || [];

  useEffect(() => {
    if (queryScheduler.secondQueryCompletedAt) {
      logSourcesRequest.call({ date, filterOrExcludeByFingerprint });
    }
  }, [queryScheduler.secondQueryCompletedAt]);

  useEffect(() => {
    if (queryScheduler.secondQueryCompletedAt) {
      getLabelNamesRequest.call({
        date,
        filterOrExcludeByFingerprint,
        filterByFacets,
        keyExists,
        searchTerms,
        selectedFacetValues,
      });
    }
  }, [queryScheduler.secondQueryCompletedAt]);

  const { additionalLabels, cloudLabels, kubernetesLabels } = useMemo(
    () => groupLabels(getLabelNamesRequest.result || []),
    [getLabelNamesRequest.result],
  );

  useEffect(() => {
    setLabels({
      additional: additionalLabels,
      cloud: cloudLabels,
      core: CoreLabels,
      kubernetes: kubernetesLabels,
    });
  }, [additionalLabels, CoreLabels, cloudLabels, kubernetesLabels]);

  return (
    <div
      className={classnames({
        logs__sidebar: true,
      })}
    >
      <div className="logs__sidebar__header">
        <LogsFacetGroupFacet
          facet={CoreLevelLabel}
          forceExpanded
          logsState={logsState}
          queryScheduler={queryScheduler}
          request={getLabelValues}
          renderValue={(label) => (
            <ChipWithLabel color={colorsByLogLevel[label]} label={label} />
          )}
        />
        <LogsFacetGroupFacet
          facet={CoreSourceLabel}
          logsState={logsState}
          request={getLabelValues}
          queryScheduler={queryScheduler}
        />
      </div>
      <div className="logs__sidebar__body">
        <div className="logs__sidebar__body__section">
          <div className="logs__sidebar__body__section__title">
            <div className="logs__sidebar__body__section__title__icon">
              <MdOutlineLabel size={18} />
            </div>
            <div className="logs__sidebar__body__section__title__text">
              Labels
            </div>
          </div>
          <LogsFacetGroup
            component="Cloud"
            hardcodedFacets={cloudLabels}
            logsState={logsState}
            queryScheduler={queryScheduler}
          />
          <LogsFacetGroup
            component="Kubernetes"
            hardcodedFacets={kubernetesLabels}
            logsState={logsState}
            queryScheduler={queryScheduler}
          />
          <LogsFacetGroup
            component="Additional"
            hardcodedFacets={additionalLabels}
            logsState={logsState}
            queryScheduler={queryScheduler}
          />
        </div>
        <div className="logs__sidebar__body__section">
          <div className="logs__sidebar__body__section__title">
            <div className="logs__sidebar__body__section__title__icon">
              <HiOutlineServer size={18} />
            </div>
            <div className="logs__sidebar__body__section__title__text">
              Sources
            </div>
          </div>
          <Loader isLoading={logSourcesRequest.isLoading}>
            {components
              .sort((a, b) => a.localeCompare(b))
              .map((component: string) => (
                <LogsFacetGroup
                  component={component}
                  key={component}
                  logsState={logsState}
                  queryScheduler={queryScheduler}
                />
              ))}
          </Loader>
        </div>
      </div>
    </div>
  );
};

export default LogsSidebar;
