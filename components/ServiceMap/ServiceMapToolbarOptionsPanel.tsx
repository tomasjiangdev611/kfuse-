import { Checkbox } from 'components';
import { useOnClickOutside } from 'hooks';
import React, { useRef } from 'react';
import { AiOutlineLoading, AiOutlineLine } from 'react-icons/ai';
import { GrBottomCorner, GrTopCorner } from 'react-icons/gr';
import { EdgeType, Orientation } from './types';
import { Picker } from '../Picker';

const edgeTypeOptions = [
  // { label: <GrBottomCorner />, value: EdgeType.bezier },
  { label: <GrTopCorner />, value: EdgeType.smoothstep },
  { label: <AiOutlineLine />, value: EdgeType.straight },
  { label: <AiOutlineLoading />, value: EdgeType.simplebezier },
  // { label: <GrBottomCorner />, value: EdgeType.step },
];

const orientationOptions = [
  { label: Orientation.horizontal, value: Orientation.horizontal },
  { label: Orientation.vertical, value: Orientation.vertical },
];

const ServiceMapToolbarOptionsPanel = ({
  close,
  customFilters,
  resetZoom,
  serviceMapState,
}) => {
  const {
    changeEdgeType,
    changeOrientation,
    state,
    toggleCustomFilterHandler,
    toggleHideDanglingNodes,
    toggleShowMiniMap,
    toggleShowOnlyPathsWithErrors,
  } = serviceMapState;
  const {
    customFilterState,
    edgeType,
    hideDanglingNodes,
    orientation,
    showMiniMap,
    showOnlyPathsWithErrors,
  } = state;

  const elementRef = useRef();

  const resetZoomAfter = (callback) => () => {
    callback();
    setTimeout(resetZoom, 500);
  };

  useOnClickOutside({
    onClick: close,
    ref: elementRef,
    shouldUseClick: true,
  });

  return (
    <div className="panel__items" ref={elementRef}>
      <div className="panel__item">
        <div className="panel__item__left text--weight-medium">Orientation</div>
        <div className="panel__item__right">
          <Picker
            onChange={changeOrientation}
            options={orientationOptions}
            value={orientation}
          />
        </div>
      </div>
      <div className="panel__item">
        <div className="panel__item__left text--weight-medium">Edge style</div>
        <div className="panel__item__right">
          <Picker
            onChange={changeEdgeType}
            options={edgeTypeOptions}
            value={edgeType}
          />
        </div>
      </div>
      <div className="panel__item">
        <div className="panel__item__left text--weight-medium">
          Hide Dangling Nodes
        </div>
        <div className="panel__item__right">
          <Checkbox
            onChange={resetZoomAfter(toggleHideDanglingNodes)}
            value={hideDanglingNodes}
          />
        </div>
      </div>
      <div className="panel__item">
        <div className="panel__item__left text--weight-medium">
          Show Mini Map
        </div>
        <div className="panel__item__right">
          <Checkbox onChange={toggleShowMiniMap} value={showMiniMap} />
        </div>
      </div>
      <div className="panel__item">
        <div className="panel__item__left text--weight-medium">
          Show Only Paths with Errors
        </div>
        <div className="panel__item__right">
          <Checkbox
            onChange={resetZoomAfter(toggleShowOnlyPathsWithErrors)}
            value={showOnlyPathsWithErrors}
          />
        </div>
      </div>
      {customFilters.map((customFilter) => (
        <div className="panel__item" key={customFilter.key}>
          <div className="panel__item__left text--weight-medium">
            {customFilter.label}
          </div>
          <div className="panel__item__right">
            <Checkbox
              onChange={resetZoomAfter(
                toggleCustomFilterHandler(customFilter.key),
              )}
              value={customFilterState[customFilter.key]}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceMapToolbarOptionsPanel;
