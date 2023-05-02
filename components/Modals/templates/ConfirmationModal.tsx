import classNames from 'classnames';
import React, { ReactElement } from 'react';

const Confirmation = ({
  className,
  description,
  onCancel,
  onConfirm,
  title,
}: {
  className?: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}): ReactElement => {
  return (
    <div
      className={classNames({
        'confirmation-modal': true,
        [className]: className,
      })}
    >
      <div className="confirmation-modal__header">{title}</div>
      <div className="confirmation-modal__body">{description}</div>
      <div className="confirmation-modal__footer">
        <button className="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="button" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
