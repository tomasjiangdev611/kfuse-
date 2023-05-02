import { D3, D3ChartTypes, Loader } from 'components';
import React, { useEffect } from 'react';
import TopologyLegend from './TopologyLegend';
import TopologySeekbar from './TopologySeekbar';
import TopologySidebar from './TopologySidebar';
import TopologyTools from './TopologyTools';
import useTopology from './useTopology';

const Topology = () => {
  const topology = useTopology();
  const { activeIndex, colors, fetch, isLoading, hexbinData, setActiveIndex } = topology;

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="topology">
      <div className="topology__main">
        <TopologyTools topology={topology} />
        <Loader className="topology__loader" isLoading={isLoading}>
          <div className="topology__chart">
            {hexbinData && hexbinData.length ? (
              <D3
                activeIndex={activeIndex}
                colors={colors}
                data={hexbinData}
                onClick={setActiveIndex}
                type={D3ChartTypes.Hexbin}
              />
            ) : null}
          </div>
          <TopologyLegend />
          <TopologySeekbar topology={topology} />
        </Loader>
      </div>
      {activeIndex !== null && hexbinData && hexbinData[activeIndex] ? (
        <TopologySidebar
          close={() => {
            setActiveIndex(null);
          }}
          entity={hexbinData[activeIndex]}
          topology={topology}
        />
      ) : null}
    </div>
  );
};

export default Topology;
