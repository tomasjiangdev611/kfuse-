import { MutableRefObject, useEffect } from 'react';

type Args = {
  onClick: (e: Event) => void;
  ref: MutableRefObject<HTMLElement>;
  shouldUseClick?: boolean;
};

const useOnClickOutside = ({ ref, onClick, shouldUseClick }: Args) => {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      onClick(event);
    };

    const event = shouldUseClick ? 'click' : 'mousedown';

    document.addEventListener(event, listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener(event, listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, onClick]);
};

export default useOnClickOutside;
