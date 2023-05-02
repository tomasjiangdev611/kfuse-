import classnames from 'classnames';
import { useOnClickOutside } from 'hooks';
import React, { MutableRefObject, ReactNode, useEffect } from 'react';
import { PanelPosition, PanelState, PanelType } from 'types';
import { getPanelStyle } from 'utils';

type Props = {
  close: VoidFunction;
  elementRef: MutableRefObject<HTMLDivElement>;
  onClose?: VoidFunction;
  panel: ReactNode;
  position: PanelPosition;
  shouldUseClickOnOutsideClick?: boolean;
  state: PanelState;
  type: PanelType;
};

const Panel = ({
  close,
  elementRef,
  onClose,
  panel,
  position,
  shouldUseClickOnOutsideClick,
  state,
  type,
}: Props) => {
  const onOutsideClick = () => {
    if (onClose) {
      onClose();
    }

    close();
  };

  useOnClickOutside({
    onClick: onOutsideClick,
    ref: elementRef,
    shouldUseClick: shouldUseClickOnOutsideClick,
  });

  useEffect(() => {
    if (type === PanelType.tooltip) {
      const onMouseMove = (e) => {
        const element = elementRef.current;
        if (element) {
          if (!element.contains(e.target)) {
            close();
          }
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      return () => {
        document.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, []);

  return (
    <div
      className={classnames({
        panel: true,
        [`panel--${position}`]: true,
        [`panel--${type}`]: true,
      })}
      style={getPanelStyle(position, state)}
    >
      <div className="panel__content">{panel}</div>
    </div>
  );
};

export default Panel;
