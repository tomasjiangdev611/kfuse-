import classnames from 'classnames';
import { delimiter } from 'constants';
import { X } from 'react-feather';
import { useLogsState } from './hooks';
import React from 'react';

type Props = {
  component: string;
  logsState: ReturnType<typeof useLogsState>;
  name: string;
};

const LogsFacetGroupFacetTitleResetButton = ({
  component,
  logsState,
  name,
}: Props) => {
  const { resetFacet, selectedFacetValues } = logsState;
  const matchedCompositeKeys = Object.keys(selectedFacetValues).filter(
    (facetValueCompositeKey) => {
      const [keyComponent, keyName] = facetValueCompositeKey.split(delimiter);
      return keyComponent === component && keyName === name;
    },
  );

  const hasBeenModified = matchedCompositeKeys.length;

  if (hasBeenModified) {
    const isExcluding = selectedFacetValues[matchedCompositeKeys[0]] === 0;
    const onClick = () => {
      resetFacet({ component, name });
    };

    return (
      <div
        className={classnames({
          'logs__facet-group__facet__title__reset-button': true,
          'logs__facet-group__facet__title__reset-button--excluding': isExcluding,
        })}
      >
        <div className="logs__facet-group__facet__title__reset-button__number">
          {matchedCompositeKeys.length}
        </div>
        <button
          className="logs__facet-group__facet__title__reset-button__x"
          onClick={onClick}
        >
          <X size={10} />
        </button>
      </div>
    );
  }

  return null;
};

export default LogsFacetGroupFacetTitleResetButton;
