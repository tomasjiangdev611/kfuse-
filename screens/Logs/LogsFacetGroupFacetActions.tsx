import { delimiter } from 'constants';
import React from 'react';
import { AlignCenter } from 'react-feather';
import { AiOutlineKey, AiOutlineLineChart } from 'react-icons/ai';
import { useNavigate, useSearchParams } from 'react-router-dom';

const getActions = ({ chartFacet, close, facet, navigate, searchParams, toggleKeyExists }) => {
  const { component, name, type } = facet;

  const result =
    type === 'number' || type === 'duration'
      ? [
          {
            key: 'chart',
            icon: <AiOutlineLineChart />,
            label: `Chart ${name}`,
            onClick: () => {
              chartFacet(facet);
            },
          },
        ]
      : [];

  if (
    !(
      component === 'Core' ||
      component === 'Kubernetes' ||
      component === 'Cloud'
    )
  ) {
    result.push({
      key: 'keyExists',
      icon: <AiOutlineKey size={12} />,
      label: `Show logs where ${name} exists`,
      onClick: () => {
        toggleKeyExists({ component, name, type });
        close();
      },
    });
  }

  result.push({
    key: 'transaction',
    icon: <AlignCenter size={12} />,
    label: 'Show Transactions',
    onClick: () => {
      searchParams.set('facetKey', `${component}${delimiter}${name}`);
      navigate(`/logs/transactions?${searchParams.toString()}`);
      close();
    },
  });

  return result;
};

const LogsFacetGroupFacetActions = ({
  close,
  facet,
  toggleKeyExists,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const chartFacet = (facet) => {
    const { component, name, type } = facet;
    searchParams.set('facetKey', `${component}${delimiter}${name}${delimiter}${type}`)
    navigate(`/logs/chart?${searchParams}`);
    close();
  };

  const actions = getActions({
    chartFacet,
    close,
    facet,
    navigate,
    searchParams,
    toggleKeyExists,
  });

  return (
    <div className="logs__facet-group__facet__title__actions__panel">
      {actions.map((action) => (
        <button
          className="popover__panel__item"
          key={action.key}
          onClick={action.onClick}
        >
          <span className="popover__panel__item__icon">{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LogsFacetGroupFacetActions;
