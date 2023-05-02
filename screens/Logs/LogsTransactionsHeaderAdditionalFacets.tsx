import { Multiselect } from 'components';
import { delimiter } from 'constants';
import React from 'react';

const LogsTransactionsHeaderAdditionalFacets = ({
  availableFacets,
  date,
  facetKey,
  form,
  logsState,
  transactions,
  transactionsWebsocket,
}) => {
  const { propsByKey } = form;
  const { onChange, value } = propsByKey('facets');

  return (
    <div className="logs__transactions__facet__header__field logs__transactions__facet__header__field--additional">
      <div className="logs__transactions__facet__header__field__label">
        Additional Facets
      </div>
      <div className="logs__transactions__facet__header__field__input">
        <Multiselect
          options={availableFacets.reduce((arr, facet) => {
            const { component, name } = facet;
            const label = `${component}:${name}`;
            const facetKey = `${component}${delimiter}${name}`;
            return [
              ...arr,
              {
                label: `*.${name}`,
                value: `*${delimiter}${name}`,
              },
              {
                label,
                value: facetKey,
              },
            ];
          }, [])}
          onChange={(nextValue) => {
            transactions.clear();
            transactionsWebsocket.stop();
            onChange(nextValue);
          }}
          value={value}
        />
      </div>
    </div>
  );
};

export default LogsTransactionsHeaderAdditionalFacets;
