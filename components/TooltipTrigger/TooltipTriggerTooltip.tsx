import classnames from 'classnames';
import React, { useEffect } from 'react';

const TooltipTriggerTooltip = ({
  close,
  elementRef,
  position,
  style,
  tooltip,
}) => {
  useEffect(() => {
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
  }, []);

  return (
    <div
      className={classnames({
        'tooltip-trigger__tooltip': true,
        [`tooltip-trigger__tooltip--${position}`]: true,
      })}
      style={style}
    >
      <div className="tooltip-trigger__tooltip__content">{tooltip}</div>
    </div>
  );
};

export default TooltipTriggerTooltip;
