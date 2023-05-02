import React from 'react';
import { LinePath } from '@visx/shape';
import { curveCatmullRom, curveLinear } from '@visx/curve';
import getLinkKey from './getLinkKey';
import { ServiceMapType } from './types';

const TracesServiceMapLink = ({
  activeServiceMapType,
  containerRef,
  date,
  hoveredLinkState,
  link,
  selectedFacetValuesByName,
}) => {
  const [hoveredLink, setHoveredLink] = hoveredLinkState;
  const key = getLinkKey(link);

  const isHovered = hoveredLink?.link && getLinkKey(hoveredLink.link) === key;

  const onMouseEnter = (e) => {
    if (!isHovered) {
      const container = containerRef.current;
      const { offsetLeft, offsetTop } = container;
      const { clientX, clientY } = e;

      const top = clientY - offsetTop;
      const left = clientX - offsetLeft;
      setHoveredLink({ link, top, left });
    }
  };

  const onMouseLeave = () => {
    setHoveredLink(null);
  };

  return (
    <LinePath
      key={key}
      curve={
        activeServiceMapType === ServiceMapType.flow
          ? curveLinear
          : curveCatmullRom
      }
      data={link.points}
      x={(d) => d.x}
      y={(d) => d.y}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      stroke={hoveredLink && !isHovered ? '#ddd' : '#bbb'}
      strokeWidth={1}
      markerEnd="url(#marker-arrow)"
    />
  );
};

export default TracesServiceMapLink;
