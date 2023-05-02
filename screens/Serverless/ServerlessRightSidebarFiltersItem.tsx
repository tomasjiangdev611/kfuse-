import { PopoverTrigger } from 'components';
import { useSelectedFacetValuesByNameState } from 'hooks';
import React from 'react';
import { DateSelection } from 'types';
import ServerlessRightSidebarFiltersItemPanel from './ServerlessRightSidebarFiltersItemPanel';

type Props = {
  date: DateSelection;
  facetName: string;
  name: string;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  value: string;
};

const ServerlessRightSidebarFiltersItem = ({
  date,
  facetName,
  name,
  selectedFacetValuesByNameState,
  value,
}: Props) => {
  return (
    <div className="serverless__right-sidebar__filters__item">
      <PopoverTrigger
        component={ServerlessRightSidebarFiltersItemPanel}
        props={{ date, facetName, name, selectedFacetValuesByNameState, value }}
      >
        <div className="serverless__right-sidebar__filters__item__label">
          {name}
        </div>
        <div className="serverless__right-sidebar__filters__item__value">
          {value}
        </div>
      </PopoverTrigger>
    </div>
  );
};

export default ServerlessRightSidebarFiltersItem;
