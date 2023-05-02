import React from 'react';
import KnightSidebarActiveLink from './KnightSidebarActiveLink';
import KnightSidebarActiveNode from './KnightSidebarActiveNode';

const KnightSidebar = ({ knight }) => {
  const { activeLink, activeNode, clearActive, linksById } = knight;

  if (activeLink) {
    return <KnightSidebarActiveLink activeLink={activeLink} />;
  }

  if (activeNode) {
    return <KnightSidebarActiveNode activeNode={activeNode} />;
  }

  return <div className="knight__padder" />;
};

export default KnightSidebar;
