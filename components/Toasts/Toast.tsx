import classnames from 'classnames';
import React, { ReactElement, useEffect } from 'react';
import { Check, X, AlertTriangle } from 'react-feather';

import { ToastProps, ToastStatus } from './types';

const ToastIcon = ({ status }: { status: ToastStatus }) => {
  return (
    <div
      className={classnames({
        toast__icon: true,
        [`toast__icon--${status}`]: true,
      })}
    >
      {status === 'success' ? (
        <Check className="toast__icon--color" />
      ) : status === 'error' ? (
        <X className="toast__icon--color" />
      ) : status === 'warn' ? (
        <AlertTriangle className="toast__icon--color" />
      ) : null}
    </div>
  );
};

const ToastCloseIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={classnames({ toast__icon: true, 'toast__icon--close': true })}
    >
      <X size={16} color="grey" />
    </div>
  );
};

const Toast = ({
  removeToast,
  toast,
}: {
  removeToast: (id: string) => void;
  toast: ToastProps;
}): ReactElement => {
  const { id, status, text, timeout } = toast;

  useEffect(() => {
    const toastSetTimeout = setTimeout(() => {
      removeToast(id);
    }, timeout || 2500);

    return () => {
      clearTimeout(toastSetTimeout);
    };
  }, []);

  return (
    <div className={classnames({ toast: true })}>
      <ToastIcon status={status} />
      <div className="toast__text">{text}</div>
      <ToastCloseIcon onClick={() => removeToast(id)} />
    </div>
  );
};

export default Toast;
