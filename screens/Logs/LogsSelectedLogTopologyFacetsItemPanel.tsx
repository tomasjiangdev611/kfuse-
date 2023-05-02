import React, { ReactElement } from 'react';
import { Search, XCircle } from 'react-feather';

type Props = {
  close: () => void;
  topoFacet: any;
};

const nameToFacetName = {
  host: 'host',
  podName: 'pod_name',
  kubeContainerName: 'kube_container_name',
  kubeNamespace: 'kube_namespace',
  kubeService: 'kube_service',
  image: 'docker_image',
};

const LogsSelectedLogTopologyFacetsItemPanel = ({
  close,
  logsState,
  topoFacet,
}: Props): ReactElement => {
  const { filterOnlyFacetValueFromLogEventDetail } = logsState;

  const onExcludeTopoFacetValue = () => {
    filterOnlyFacetValueFromLogEventDetail({
      exclude: true,
      name: nameToFacetName[topoFacet.name],
      source: 'Kubernetes',
      value: topoFacet.value,
    });
    close();
  };

  const onSelectOnlyTopoFacetValue = () => {
    filterOnlyFacetValueFromLogEventDetail({
      name: nameToFacetName[topoFacet.name],
      source: 'Kubernetes',
      value: topoFacet.value,
    });
    close();
  };

  return (
    <div className="logs__selected-log__attribute__panel">
      <button
        className="logs__selected-log__attribute__panel__item"
        onClick={onSelectOnlyTopoFacetValue}
      >
        <Search
          className="logs__selected-log__attribute__panel__item__icon"
          size={14}
        />
        <span className="logs__selected-log__attribute__panel__item__label">
          Filter By
        </span>
        <span className="logs__selected-log__attribute__panel__item__value">
          {`${topoFacet.name}:${topoFacet.value}`}
        </span>
      </button>
      <button
        className="logs__selected-log__attribute__panel__item"
        onClick={onExcludeTopoFacetValue}
      >
        <XCircle
          className="logs__selected-log__attribute__panel__item__icon"
          size={14}
        />
        <span className="logs__selected-log__attribute__panel__item__label">
          Exclude
        </span>
        <span className="logs__selected-log__attribute__panel__item__value">
          {`${topoFacet.name}:${topoFacet.value}`}
        </span>
      </button>
    </div>
  );
};

export default LogsSelectedLogTopologyFacetsItemPanel;
