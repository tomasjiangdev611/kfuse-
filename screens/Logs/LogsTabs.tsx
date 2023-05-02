import classnames from 'classnames';
import React, { ReactElement } from 'react';
import { AiOutlineLineChart } from 'react-icons/ai';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { ImTable } from 'react-icons/im';
import { RiFingerprintLine } from 'react-icons/ri';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

type Args = {
  navigate: ReturnType<typeof useNavigate>;
  params: URLSearchParams;
  tab: string;
};

const getItems = ({ navigate, params, tab }: Args) => {
  const result = [
    {
      key: 'logs',
      icon: <ImTable size={14} />,
      isActive: tab === undefined || tab === 'live-tail',
      label: 'Logs',
      onClick: () => {
        navigate(`/logs?${params.toString()}`);
      },
    },
    {
      key: 'fingerprints',
      icon: <RiFingerprintLine size={14} />,
      isActive: tab === 'fingerprints',
      label: 'Fingerprints',
      onClick: () => {
        navigate(`/logs/fingerprints?${params.toString()}`);
      },
    },
    // {
    //   key: 'transactions',
    //   icon: <CgArrowsExchangeAlt size={16} />,
    //   isActive: tab === 'transactions',
    //   label: 'Transactions',
    //   onClick: () => {
    //     navigate(`/logs/transactions?${params.toString()}`);
    //   },
    // },
    {
      key: 'chart',
      icon: <AiOutlineLineChart size={14} />,
      isActive: tab === 'chart',
      label: 'Analytics',
      onClick: () => {
        navigate(`/logs/chart?${params.toString()}`);
      },
    },
  ];

  return result;
};

const LogsTabs = (): ReactElement => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const [params] = useSearchParams();

  const items = getItems({ navigate, params, tab });

  return (
    <div className="logs__tabs">
      {items.map((item) => (
        <button
          className={classnames({
            logs__tabs__item: true,
            'logs__tabs__item--active': item.isActive,
          })}
          key={item.key}
          onClick={item.onClick}
        >
          <div className="logs__tabs__item__icon">{item.icon}</div>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default LogsTabs;
