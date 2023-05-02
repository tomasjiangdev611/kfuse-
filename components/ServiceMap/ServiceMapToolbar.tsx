import classnames from 'classnames';
import React, { useMemo } from 'react';
import { Settings } from 'react-feather';
import { BiFullscreen, BiZoomIn, BiZoomOut } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineMyLocation } from 'react-icons/md';
import ServiceMapToolbarOptionsPanel from './ServiceMapToolbarOptionsPanel';
import { PopoverPosition, PopoverTriggerV2 } from '../PopoverTriggerV2';
import { Select } from '../SelectV2';

const ServiceMapToolbar = ({
  customFilters,
  initialNodes,
  reactFlow,
  resetZoom,
  serviceMapState,
}) => {
  const { changeFocusedNodeId, changeSearch, resetFocusedNodeId, state } =
    serviceMapState;
  const { focusedNodeId, search, selectedNodeId } = state;

  const zoomIn = () => {
    reactFlow.zoomIn({ duration: 200 });
  };

  const zoomOut = () => {
    reactFlow.zoomOut({ duration: 200 });
  };

  const changeFocusedNodeIdHandler = () => {
    changeFocusedNodeId();
    setTimeout(resetZoom, 500);
  };

  const resetFocusedNodeIdHandler = () => {
    resetFocusedNodeId();
    setTimeout(resetZoom, 500);
  };

  const searchOptions = useMemo(
    () =>
      initialNodes
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((node) => ({ label: node.id, value: node.id })),
    [initialNodes],
  );

  const onSearchSelection = (nodeId: string) => {
    changeSearch(nodeId);
    setTimeout(resetZoom, 500);
  };

  return (
    <div className="service-map__toolbar">
      <div className="service-map__toolbar__left">
        <div className="service-map__toolbar__item">
          <button
            className="button button--icon button--naked"
            onClick={zoomIn}
          >
            <BiZoomIn size={16} />
          </button>
        </div>
        <div className="service-map__toolbar__item">
          <button
            className="button button--icon button--naked"
            onClick={zoomOut}
          >
            <BiZoomOut size={16} />
          </button>
        </div>
        <div className="service-map__toolbar__item">
          <button
            className="button button--naked button--short"
            onClick={resetZoom}
          >
            <BiFullscreen className="button__icon" size={16} />
            <span>Reset Zoom</span>
          </button>
        </div>
        {selectedNodeId ? (
          <div className="service-map__toolbar__item">
            <button
              className={classnames({
                button: true,
                'button--active': focusedNodeId,
                'button--naked': true,
                'button--short': true,
              })}
              onClick={
                focusedNodeId
                  ? resetFocusedNodeIdHandler
                  : changeFocusedNodeIdHandler
              }
            >
              <MdOutlineMyLocation className="button__icon" size={16} />
              <span>{focusedNodeId ? 'Reset focus' : 'Focus on selected'}</span>
            </button>
          </div>
        ) : null}
      </div>
      <div className="service-map__toolbar__center">
        <div className="service-map__toolbar__item">
          <div className="service-map__toolbar__search">
            <FaSearch className="search-map__toolbar__search__icon" />
            <Select
              className="search-map__toolbar__search__input select--small select--naked select--underline"
              isAutocompleteEnabled
              onSearchChange={changeSearch}
              onChange={onSearchSelection}
              options={searchOptions}
              placeholder={search || 'Search Nodes'}
              value={search}
            />
          </div>
        </div>
      </div>
      <div className="service-map__toolbar__right">
        <div className="service-map__toolbar__item">
          <div className="service-map__toolbar__legend">
            <div className="service-map__toolbar__legend__selected" />
            Selected
          </div>
        </div>
        <div className="service-map__toolbar__item">
          <div className="service-map__toolbar__legend">
            <div className="service-map__toolbar__legend__error" />
            Errors
          </div>
        </div>
        <div className="service-map__toolbar__item">
          <div className="service-map__toolbar__legend">
            <div className="service-map__toolbar__legend__outer-ring" />
            {'Highlight '}
            <Select
              className="select--naked select--small select--underline"
              onChange={serviceMapState.changeOuterRingKey}
              options={[
                { label: 'Nothing', value: null },
                { label: 'Requests', value: 'requests' },
              ]}
              placeholder="Nothing"
              right
              value={serviceMapState.state.outerRingKey}
            />
          </div>
        </div>
      </div>
      <div className="service-map__toolbar__item">
        <PopoverTriggerV2
          popover={(props) => (
            <ServiceMapToolbarOptionsPanel
              {...props}
              customFilters={customFilters}
              resetZoom={resetZoom}
              serviceMapState={serviceMapState}
            />
          )}
          position={PopoverPosition.BOTTOM_RIGHT}
        >
          <div className="button button--short">
            <Settings className="button__icon" size={14} />
            <span>Options</span>
          </div>
        </PopoverTriggerV2>
      </div>
    </div>
  );
};

export default ServiceMapToolbar;
