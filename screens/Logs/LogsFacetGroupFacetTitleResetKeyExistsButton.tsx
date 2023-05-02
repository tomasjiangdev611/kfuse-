import classnames from 'classnames';
import { delimiter } from 'constants';
import { BsKeyFill } from 'react-icons/bs';
import { X } from 'react-feather';
import { useLogsState } from './hooks';
import React from 'react';

type Props = {
  component: string;
  logsState: ReturnType<typeof useLogsState>;
  name: string;
  type: string;
};

const LogsFacetGroupFacetTitleResetKeyExistsButton = ({
  component,
  logsState,
  name,
  type,
}: Props) => {
  const { keyExists, toggleKeyExists } = logsState;

  const onClick = () => {
    toggleKeyExists({ component, name, type });
  };

  return (
    <div
      className={classnames({
        'logs__facet-group__facet__title__reset-button': true,
      })}
    >
      <div className="logs__facet-group__facet__title__reset-button__icon">
        <BsKeyFill color="#FFFFFF" size={12} />
      </div>
      <button
        className="logs__facet-group__facet__title__reset-button__x"
        onClick={onClick}
      >
        <X size={10} />
      </button>
    </div>
  );
};

export default LogsFacetGroupFacetTitleResetKeyExistsButton;
