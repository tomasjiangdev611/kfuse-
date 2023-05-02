import classnames from 'classnames';
import React, {
  forwardRef,
  HTMLProps,
  MutableRefObject,
  ReactElement,
} from 'react';

const defaultProps = {
  children: null,
} as Partial<Props>;

type Props = {
  children?: ReactElement | ReactElement[];
  className?: string;
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
} & HTMLProps<HTMLDivElement>;

const Loader = forwardRef(
  (
    { children, className, isLoading, size = 'medium', ...rest }: Props,
    ref: MutableRefObject<HTMLDivElement>,
  ): ReactElement => {
    return (
      <div
        className={classnames({ loader: true, [className]: className })}
        ref={ref}
        {...rest}
      >
        {children ? children : null}
        {isLoading && (
          <div className="loader__bg">
            <div
              className={classnames({
                loader__spinner: true,
                [`loader__spinner--${size}`]: true,
              })}
            >
              <div className="loader__spinner__rect1" />
              <div className="loader__spinner__rect2" />
              <div className="loader__spinner__rect3" />
              <div className="loader__spinner__rect4" />
              <div className="loader__spinner__rect5" />
            </div>
          </div>
        )}
      </div>
    );
  },
);

Loader.defaultProps = defaultProps;

export default Loader;
