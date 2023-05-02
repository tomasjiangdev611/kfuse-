import { Autocomplete, Input } from 'components';
import { Datepicker } from 'composite';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { getEntityTypes } from 'requests';

const entityTypeOptions = (entityTypes) =>
  entityTypes.map((entityType) => ({
    label: entityType,
    value: entityType,
  }));

const TopologyTools = ({ topology }) => {
  const {
    date,
    entityType,
    onChangeEntityType,
    onChangeDate,
    search,
    setSearch,
  } = topology;
  const entityTypesRequest = useRequest(getEntityTypes);

  useEffect(() => {
    entityTypesRequest.call();
  }, []);

  return (
    <div className="topology__tools">
      <div className="topology__left">
        <div className="topology__tools__item">
          <Autocomplete
            onChange={onChangeEntityType}
            options={entityTypeOptions(entityTypesRequest.result || [])}
            placeholder="Entity type (optional)"
            value={entityType}
          />
        </div>
        <div className="topology__tools__item">
          <Input
            className="input"
            onChange={setSearch}
            placeholder={`Search${entityType ? ` ${entityType}` : ''}`}
            type="text"
            value={search}
          />
        </div>
      </div>
      <div className="topology__right">
        <div className="topology__tools__item">
          <Datepicker onChange={onChangeDate} value={date} />
        </div>
      </div>
    </div>
  );
};

export default TopologyTools;
