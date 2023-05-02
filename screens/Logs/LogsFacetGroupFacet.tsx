import { FlyoutCaret, TooltipPosition, TooltipTrigger } from 'components';
import { delimiter } from 'constants';
import { useToggle, useRequest } from 'hooks';
import React, { ReactElement, ReactNode, useRef } from 'react';
import { BsKeyFill } from 'react-icons/bs';
import { useLogsState, useQueryScheduler } from './hooks';
import LogsFacetGroupFacetNames from './LogsFacetGroupFacetNames';
import LogsFacetGroupFacetTitleResetButton from './LogsFacetGroupFacetTitleResetButton';
import LogsFacetGroupFacetTitleResetKeyExistsButton from './LogsFacetGroupFacetTitleResetKeyExistsButton';
import { FacetBase } from './types';

type Props = {
  facet: FacetBase;
  forceExpanded?: boolean;
  logsState: ReturnType<typeof useLogsState>;
  queryScheduler: ReturnType<typeof useQueryScheduler>;
  renderValue?: (label: string) => ReactNode;
  request: (args: any) => Promise<any>;
};

const LogsFacetGroupFacet = ({
  facet,
  forceExpanded,
  logsState,
  renderValue,
  request,
  queryScheduler,
}: Props): ReactElement => {
  const getLogFacetValuesCountsRequest = useRequest(request);
  const expandedToggle = useToggle();
  const { component, name, type } = facet;
  const expanded = forceExpanded || expandedToggle.value;
  const ref = useRef(null);

  const { keyExists, toggleKeyExists } = logsState;
  const toggleKeyExistsHandler = () => {
    toggleKeyExists({ component, name, type });
  };

  const keyExistsKey = `${component}${delimiter}${name}${delimiter}${type}`;
  const hasKeyExistsFilterEnabled = keyExists[keyExistsKey];

  return (
    <>
      <div className="logs__facet-group__facet" ref={ref}>
        <div className="logs__facet-group__facet__title">
          {forceExpanded ? (
            <div className="logs__facet-group__facet__title__button">
              <div className="logs__facet-group__facet__title__button__text">
                {name}
              </div>
            </div>
          ) : (
            <button
              className="logs__facet-group__facet__title__button"
              onClick={expandedToggle.toggle}
            >
              <div className="logs__facet-group__facet__title__button__flyout-caret">
                <FlyoutCaret isOpen={expanded} />
              </div>
              <div className="logs__facet-group__facet__title__button__text">
                {name}
              </div>
            </button>
          )}
          <div className="logs__facet-group__facet__title__more-actions">
            {!hasKeyExistsFilterEnabled && name !== 'source' ? (
              <TooltipTrigger
                position={TooltipPosition.TOP}
                tooltip={`Show logs where ${name} exists`}
              >
                <button
                  className="logs__facet-group__facet__title__more-actions__button"
                  onClick={toggleKeyExistsHandler}
                >
                  <BsKeyFill size={20} />
                </button>
              </TooltipTrigger>
            ) : null}
          </div>
          <div className="logs__facet-group__facet__title__actions">
            {hasKeyExistsFilterEnabled ? (
              <LogsFacetGroupFacetTitleResetKeyExistsButton
                component={component}
                logsState={logsState}
                name={name}
                type={type}
              />
            ) : null}
            <LogsFacetGroupFacetTitleResetButton
              component={component}
              name={name}
              logsState={logsState}
            />
          </div>
        </div>
        {expanded ? (
          <LogsFacetGroupFacetNames
            facet={facet}
            disableSearch={forceExpanded}
            getLogFacetValuesCountsRequest={getLogFacetValuesCountsRequest}
            logsState={logsState}
            renderValue={renderValue}
            queryScheduler={queryScheduler}
          />
        ) : null}
      </div>
    </>
  );
};

export default LogsFacetGroupFacet;
