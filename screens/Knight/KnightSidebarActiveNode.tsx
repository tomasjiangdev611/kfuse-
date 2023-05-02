import React from 'react';

const KnightSidebarActiveNode = ({ activeNode }) => {
  return (
    <div className="knight__sidebar">
      <div className="knight__sidebar__header">
        {activeNode.kubernetesCommon?.baseEntity?.name || activeNode.id}
      </div>
    </div>
  );
};

export default KnightSidebarActiveNode;
