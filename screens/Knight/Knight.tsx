import { D3, D3ChartTypes, Loader, Select } from 'components';
import { Datepicker } from 'composite';
import React, { useEffect } from 'react';
import { Graph } from 'react-d3-graph';
import KnightSidebar from './KnightSidebar';
import useKnight from './useKnight';

const protocolOptions = ['Cassandra', 'Http'].map((protocol) => ({
  label: protocol,
  value: protocol,
}));

const Knight = () => {
  const knight = useKnight();
  const {
    date,
    init,
    isLoading,
    links,
    nodes,
    onChangeDate,
    onClickLink,
    onClickNode,
    onChangeProtocol,
    protocol,
  } = knight;

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="knight">
      <div className="knight__toolbar">
        <div className="knight__toolbar__left">
          <Select
            onChange={onChangeProtocol}
            options={protocolOptions}
            placeholder="Select a protocol"
            value={protocol}
          />
        </div>
        <div className="knight__toolbar__right">
          <div className="knight__tools__item">
            <Datepicker onChange={onChangeDate} value={date} />
          </div>
        </div>
      </div>
      <Loader className="knight__main" isLoading={isLoading}>
        <div className="knight__graph">
          <D3
            config={{
              directed: true,
              focusAnimationDuration: 0,
              initialZoom: 3,
              link: {
                highlightColor: '#000000',
                markerHeight: 3,
                markerWidth: 3,
              },
              linkHighlightBehavior: true,
              node: {
                color: '#c3e29c',
                fontSize: 5,
                highlightFontSize: 5,
                labelProperty: (node) =>
                  node.kubernetesCommon?.baseEntity?.name || node.id,
                strokeColor: '#6a9c29',
                strokeWidth: 1,
              },
            }}
            data={{ links, nodes }}
            id="knight-graph"
            onClickLink={onClickLink}
            onClickNode={onClickNode}
            type={D3ChartTypes.Graph}
          />
        </div>
        <KnightSidebar knight={knight} />
      </Loader>
    </div>
  );
};

export default Knight;
