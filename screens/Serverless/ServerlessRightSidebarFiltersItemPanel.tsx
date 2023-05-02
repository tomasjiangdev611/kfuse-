import { useSelectedFacetValuesByNameState } from 'hooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DateSelection } from 'types';

type Props = {
  close: () => void;
  date: DateSelection;
  facetName: string;
  name: string;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  value: string;
};

const ServerlessRightSidebarFiltersItemPanel = ({
  close,
  date,
  facetName,
  name,
  selectedFacetValuesByNameState,
  value,
}: Props) => {
  const navigate = useNavigate();
  const items = [
    {
      label: (
        <span>
          {'Filter By '}
          <span className="text--weight-bold">{`${name}:${value}`}</span>
        </span>
      ),
      onClick: () => {
        selectedFacetValuesByNameState.selectOnlyFacetValue({ name, value });
      },
    },
    {
      label: (
        <span>
          {'Exclude '}
          <span className="text--weight-bold">{`${name}:${value}`}</span>
        </span>
      ),
      onClick: () => {
        selectedFacetValuesByNameState.excludeFacetValue({ name, value });
      },
    },
    {
      label: 'Copy to clipboard',
      onClick: () => {
        navigator.clipboard.writeText(value);
      },
    },
    {
      label: 'View related logs',
      onClick: () => {
        const selectedFacetValues = {
          [`Additional:!:${name}:!:${value}`]: 1,
        };
        navigate(
          `/logs?date=${encodeURIComponent(
            JSON.stringify(date),
          )}&selectedFacetValues=${encodeURIComponent(
            JSON.stringify(selectedFacetValues),
          )}`,
        );
      },
    },
    {
      label: 'View related traces',
      onClick: () => {
        const selectedFacetValuesByName = { [facetName]: { [value]: 1 } };
        navigate(
          `/apm/traces?date=${encodeURIComponent(
            JSON.stringify(date),
          )}&selectedFacetValuesByName=${encodeURIComponent(
            JSON.stringify(selectedFacetValuesByName),
          )}`,
        );
      },
    },
  ];
  return (
    <div className="serverless__right-sidebar__filters__item__panel">
      {items.map((item, i) => (
        <div
          className="serverless__right-sidebar__filters__item__panel__item"
          onClick={() => {
            item.onClick();
            close();
          }}
          key={i}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default ServerlessRightSidebarFiltersItemPanel;
