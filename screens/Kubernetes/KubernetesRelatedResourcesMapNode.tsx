import { ChipWithLabel } from 'components';
import { useToggle } from 'hooks';
import React from 'react';
import { DateSelection } from 'types';
import KubernetesRelatedResourcesMapNodeToolTip from './KubernetesRelatedResourcesMapNodeToolTip';

type Props = {
  colorsByEntityName: { [key: string]: string };
  date: DateSelection;
  nodeDatum: {
    attributes: {
      entity_name: string;
      entity_value: string;
    };
  };
};

const KubernetesRelatedResourcesMapNode = ({
  colorsByEntityName,
  nodeDatum,
}: Props) => {
  const showTooltipToggle = useToggle(false);
  const { entity_name: entityName, entity_value: entityValue } =
    nodeDatum.attributes;
  const onMouseEnter = () => {
    showTooltipToggle.on();
  };

  return (
    <g height={100} width={200}>
      <foreignObject className="kubernetes-foreign-object">
        <div
          className="kubernetes-map__node"
          onMouseEnter={onMouseEnter}
          onMouseLeave={showTooltipToggle.off}
        >
          <div className="kubernetes-map__node__circle">
            <div className="kubernetes-map__node__circle__inner"></div>
          </div>
          <div className="kubernetes-map__node__label">
            <div>
              <ChipWithLabel
                color={colorsByEntityName[entityName]}
                label={
                  <div>
                    {entityName}
                    <button className="kubernetes-map__node__label__span-link link">
                      {entityValue}
                    </button>
                  </div>
                }
              />
            </div>
          </div>
          {showTooltipToggle.value ? (
            <KubernetesRelatedResourcesMapNodeToolTip
              entityValue={entityValue}
              entityName={entityName}
            />
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
};

export default KubernetesRelatedResourcesMapNode;
