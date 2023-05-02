import { GroupedBarChart } from 'components';
import React from 'react';

const LogsFacetModal = ({ facet }) => {
  return (
    <div className="modal modal--medium">
      <div className="modal__header">
        <div className="modal__header__text">
          {`Occurences over time grouped by "${facet.label}"`}
        </div>
      </div>
      <div className="modal__body">
        <div style={{ width: '100%', height: '400px' }}>
          <GroupedBarChart />
        </div>
      </div>
    </div>
  );
};

export default LogsFacetModal;
