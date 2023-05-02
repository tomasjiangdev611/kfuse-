import React from 'react';
import { PopoverTrigger } from 'components';
import LogsSelectedLogTopologyFacetsItemPanel from './LogsSelectedLogTopologyFacetsItemPanel';

type Props = {
  index: number;
  logsState: any;
  topoFacet: any;
};

const LogsSelectedLogTopologyFacetsItem = ({
  index,
  logsState,
  topoFacet,
}: Props) => {
  return (
    <PopoverTrigger
      className="logs__selected-log__topology-facets__item"
      component={LogsSelectedLogTopologyFacetsItemPanel}
      props={{ logsState, topoFacet }}
      right={index > 0}
      width={240}
    >
      <div className="logs__selected-log__topology-facets__item__label">
        {topoFacet.name}
      </div>
      <div
        className="logs__selected-log__topology-facets__item__value"
        title={topoFacet.value}
      >
        {topoFacet.value}
      </div>
    </PopoverTrigger>
  );
};

export default LogsSelectedLogTopologyFacetsItem;
