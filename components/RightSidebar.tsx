import classnames from 'classnames';
import { keyCodes } from 'constants';
import { useOnClickOutside } from 'hooks';
import React, { ReactElement, ReactNode, useEffect, useRef } from 'react';
import { X } from 'react-feather';

type Props = {
  className?: string;
  close: VoidFunction;
  closeOnOutsideClick?: VoidFunction;
  children: ReactNode;
  title: ReactNode;
};

const RightSidebar = ({
  className,
  children,
  close,
  closeOnOutsideClick,
  title,
}: Props): ReactElement => {
  const elementRef = useRef<HTMLDivElement>(null);
  useOnClickOutside({
    onClick: closeOnOutsideClick ? closeOnOutsideClick : close,
    ref: elementRef,
  });

  useEffect(() => {
    const listener = (e) => {
      e.stopImmediatePropagation();
      switch (e.keyCode) {
        case keyCodes.ESC:
          close();
          return;
      }
    };

    document.addEventListener('keydown', listener, { capture: true });

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <div
      className={classnames({ 'right-sidebar': true, [className]: className })}
      ref={elementRef}
    >
      <div className="right-sidebar__header">
        <div className="right-sidebar__header__title text--h2">{title}</div>
        <button className="right-sidebar__header__close" onClick={close}>
          <X size={24} />
        </button>
      </div>
      <div className="right-sidebar__body">{children}</div>
    </div>
  );
};

export default RightSidebar;
