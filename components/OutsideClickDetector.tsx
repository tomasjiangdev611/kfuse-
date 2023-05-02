import React, { useEffect, useRef } from 'react';

const OutsideClickDetector = ({ children, onOutsideClick, ...props }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      const element = elementRef.current;
      if (
        element &&
        !element.contains(e.target) &&
        (!element.className || element.className.indexOf('popover__bg') === -1)
      ) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', onClick);

    return () => {
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  return (
    <div ref={elementRef} {...props}>
      {children}
    </div>
  );
};

export default OutsideClickDetector;
