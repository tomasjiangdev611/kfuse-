import { FlyoutCaret } from 'components';
import { useToggle } from 'hooks';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  forceExpanded?: boolean;
  group: string;
};

const FacetGroup = ({ children, forceExpanded, group }: Props) => {
  const expandedToggle = useToggle();
  return (
    <div className="facet-group">
      {!forceExpanded ? (
        <button className="facet-group__button" onClick={expandedToggle.toggle}>
          <FlyoutCaret
            className="facet-group__button__flyout-caret"
            isOpen={expandedToggle.value}
          />
          {group}
        </button>
      ) : null}
      {expandedToggle.value || forceExpanded ? (
        <div className="facet-group__names">{children}</div>
      ) : null}
    </div>
  );
};

export default FacetGroup;
