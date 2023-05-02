import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useToastmasterContext } from './context';
import Toast from './Toast';
import { ToastProps } from './types';

const Toasts = () => {
  const { removeToast, toasts } = useToastmasterContext();

  return (
    <TransitionGroup className="toasts">
      {toasts.map((toast: ToastProps) => (
        <CSSTransition classNames="toast-" key={toast.id} timeout={250}>
          <Toast key={toast.id} removeToast={removeToast} toast={toast} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default Toasts;
