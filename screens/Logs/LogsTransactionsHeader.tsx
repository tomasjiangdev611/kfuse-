import { delimiter } from 'constants';
import { Autocomplete, AutocompleteOption } from 'components';
import { useForm, useRequest, useWebsocket } from 'hooks';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getFacetsNamesGivenExistingFacet } from 'requests';
import { FacetName } from 'types';
import { useLogsState, useTransactions } from './hooks';
import LogsTransactionsHeaderAdditionalFacets from './LogsTransactionsHeaderAdditionalFacets';
import { formatFacetNameWithWildcard } from './utils';

const getFacetKeyOptions = (facetNames: FacetName[]): AutocompleteOption[] => {
  const wildcardBitmap: { [label: string]: number } = {};
  const result: AutocompleteOption[] = [];

  facetNames.forEach((facetName) => {
    const { component, name } = facetName;
    const key = `${component}${delimiter}${name}`;
    const label = `${component}.${name}`;

    const wildcardOption = {
      label: `*.${name}`,
      value: `*${delimiter}${name}`,
    };

    if (!wildcardBitmap[wildcardOption.label]) {
      wildcardBitmap[wildcardOption.label] = 1;
      result.push(wildcardOption);
    }

    result.push({
      label,
      value: key,
    });
  });

  return result;
};

type Props = {
  facetKey: string;
  facetNames: FacetName[];
  form: ReturnType<typeof useForm>;
  logsState: ReturnType<typeof useLogsState>;
  transactions: ReturnType<typeof useTransactions>;
  transactionsWebsocket: ReturnType<typeof useWebsocket>;
};

const LogsTransactionsHeader = ({
  facetKey,
  facetNames,
  form,
  logsState,
  transactions,
  transactionsWebsocket,
}: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setValue } = form;
  const { date } = logsState;

  const getFacetsNamesGivenExistingFacetRequest = useRequest(
    getFacetsNamesGivenExistingFacet,
  );

  useEffect(() => {
    if (facetKey) {
      getFacetsNamesGivenExistingFacetRequest.call({
        date,
        facet: formatFacetNameWithWildcard(facetKey),
      });
    }
  }, []);

  const onClick = () => {
    if (transactionsWebsocket.isConnected) {
      transactionsWebsocket.stop();
    } else {
      const { values } = form;
      transactionsWebsocket.start({
        date,
        facets: [
          formatFacetNameWithWildcard(facetKey),
          ...form.values.facets
            .map((formFacetKey: string) =>
              formatFacetNameWithWildcard(formFacetKey),
            )
            .filter((formattedFacetName: string) => formattedFacetName),
        ],
        durationMetric: values.durationMetric,
        failureMetric: values.failureMetric,
      });
    }
  };

  const facetKeyOptions = useMemo(
    () => getFacetKeyOptions(facetNames),
    [facetNames],
  );

  return (
    <div className="logs__transactions__facet__header">
      <div className="logs__transactions__facet__header__field">
        <div className="logs__transactions__facet__header__field__label">
          Facet
        </div>
        <div className="logs__transactions__facet__header__field__input">
          <Autocomplete
            onChange={(nextFacetKey) => {
              searchParams.set('facetKey', nextFacetKey);
              navigate(`/logs/transactions?${searchParams}`);
              getFacetsNamesGivenExistingFacetRequest.call({
                date,
                facet: formatFacetNameWithWildcard(nextFacetKey),
              });
              setValue('facets', []);
            }}
            options={facetKeyOptions}
            value={facetKey}
          />
        </div>
      </div>
      {facetKey ? (
        <>
          <LogsTransactionsHeaderAdditionalFacets
            availableFacets={
              getFacetsNamesGivenExistingFacetRequest.result || []
            }
            date={date}
            facetKey={facetKey}
            form={form}
            logsState={logsState}
            transactions={transactions}
            transactionsWebsocket={transactionsWebsocket}
          />
          <div className="logs__transactions__facet__header__actions">
            <button className="button" onClick={onClick}>
              {transactionsWebsocket.isConnected ? 'Stop' : 'Start'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default LogsTransactionsHeader;
