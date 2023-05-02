import classnames from 'classnames';
import React, { ReactNode } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { AiOutlineLineChart } from 'react-icons/ai';
import { ImTable } from 'react-icons/im';
import { RiNodeTree } from 'react-icons/ri';
import { TracesTab } from 'types';

const iconByVisualizeAs: { [key in TracesTab]: ReactNode } = {
  [TracesTab.serviceMap]: <RiNodeTree size={14} />,
  [TracesTab.list]: <ImTable size={14} />,
  [TracesTab.timeseries]: <AiOutlineLineChart size={14} />,
};

const labelByVisualizeAs: { [key in TracesTab]: string } = {
  [TracesTab.serviceMap]: 'Service Map',
  [TracesTab.list]: 'List',
  [TracesTab.timeseries]: 'Timeseries',
};

const SearchVisualize = () => {
  const [searchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();
  return (
    <div className="search__visualize button-group">
      {[TracesTab.list, TracesTab.timeseries, TracesTab.serviceMap].map(
        (tracesTab) => (
          <NavLink
            className={({ isActive }) =>
              classnames({
                'button-group__item': true,
                'button-group__item--active': isActive,
              })
            }
            key={tracesTab}
            to={`/apm/traces/${tracesTab}${
              searchParamsString ? `?${searchParamsString}` : ''
            }`}
          >
            <div className="button-group__item__icon">
              {iconByVisualizeAs[tracesTab]}
            </div>
            {labelByVisualizeAs[tracesTab]}
          </NavLink>
        ),
      )}
    </div>
  );
};

export default SearchVisualize;
