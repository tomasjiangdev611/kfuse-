import classnames from 'classnames';
import React, { ReactNode } from 'react';
import useTabs from './useTabs';

type Props = {
  children?: ReactNode;
  className?: string;
  onChange?: (i: number) => void;
  tabs: ReturnType<typeof useTabs>;
};

const Tabs = ({ children, className, onChange, tabs }: Props) => {
  const { activeIndex, setActiveIndex } = tabs;

  const onClickHandler = (i: number) => () => {
    if (onChange) {
      onChange(i);
    }

    setActiveIndex(i);
  };

  return (
    <div className={classnames({ tabs: true, [className]: className })}>
      <div className="tabs__buttons">
        {React.Children.map(children, (child, i) => {
          if (child) {
            return (
              <button
                className={classnames({
                  tabs__button: true,
                  'tabs__button--active': activeIndex === i,
                })}
                onClick={onClickHandler(i)}
                type="button"
              >
                {child.props.label}
              </button>
            );
          }

          return null;
        })}
        <div className="tabs__buttons__placeholder" />
      </div>
      <div className="tabs__panel">
        {React.Children.toArray(children)[activeIndex] || null}
      </div>
    </div>
  );
};

export default Tabs;
