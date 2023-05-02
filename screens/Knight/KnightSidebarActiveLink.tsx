import React from 'react';

const KnightSidebarActiveLink = ({ activeLink }) => {
  const { tags } = activeLink;
  return (
    <div className="knight__sidebar">
      <div className="knight__sidebar__header">
        {`Link from ${activeLink.source} to ${activeLink.target}`}
      </div>
      <div className="knight__sidebar__body">
        {Object.keys(tags).map(tagKey => (
          <div className="knight__sidebar__tag" key={tagKey}>
            <div className="knight__sidebar__tag__key">
              {tagKey}
            </div>
            <div className="knight__sidebar__tag__value">
              {tags[tagKey]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnightSidebarActiveLink;
