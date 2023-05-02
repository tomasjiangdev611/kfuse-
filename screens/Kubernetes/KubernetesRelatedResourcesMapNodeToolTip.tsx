import React, { ReactNode } from 'react';

type Props = {
  entityValue: ReactNode;
  entityName: ReactNode;
};

const KubernetesRelatedResourcesMapNodeToolTip = ({
  entityValue,
  entityName,
}: Props) => {
  return (
    <div className="kubernetes-map__node__tooltip">
      <div className="kubernetes-map__node__tooltip__name">{entityValue}</div>
      <div className="kubernetes-map__node__tooltip__values__item__label">
        {'Resource: ' + entityName}
      </div>
    </div>
  );
};

export default KubernetesRelatedResourcesMapNodeToolTip;
