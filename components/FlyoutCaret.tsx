import classnames from 'classnames';
import React, { ReactElement } from 'react';
import { ChevronDown, ChevronRight } from 'react-feather';

type Props = {
  className?: string;
  isOpen: boolean;
  size?: number;
};

const FlyoutCaret = ({ className, isOpen, size = 14 }: Props): ReactElement => {
  return isOpen ? (
    <ChevronDown
      className={classnames({ [className]: className })}
      size={size}
    />
  ) : (
    <ChevronRight
      className={classnames({ [className]: className })}
      size={size}
    />
  );
};

export default FlyoutCaret;
