import classnames from 'classnames';
import { useToggle } from 'hooks';
import React, { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  onClick?: VoidFunction;
  keyCode?: number;
  text: string;
};

const Key = ({ className, keyCode, onClick, text }: Props) => {
  const isPressedToggle = useToggle();

  const onClickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  useEffect(() => {
    const onKeyUp = () => {
      isPressedToggle.off();
      document.removeEventListener('keyup', onKeyUp);
    };

    const onKeyDown = (e) => {
      if (e.keyCode === keyCode) {
        if (!isPressedToggle.value) {
          isPressedToggle.on();
        }
        document.addEventListener('keyup', onKeyUp);
      }
    };

    if (keyCode) {
      document.addEventListener('keydown', onKeyDown);
    }

    return () => {
      if (keyCode) {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
      }
    };
  }, []);

  return (
    <div
      className={classnames({
        key: true,
        'key--active': isPressedToggle.value,
        [className]: className,
      })}
      onClick={onClickHandler}
    >
      <span>{text}</span>
    </div>
  );
};

export default Key;
