import FacetGroup from 'components/FacetGroup';
import React from 'react';
import { SiKubernetes } from 'react-icons/si';
import { facetNames } from './utils';

type Props = {
  kubeName: React.Dispatch<React.SetStateAction<string>>;
  activeKube: string;
};

const KubernatesResources = ({ kubeName, activeKube }: Props) => {
  const setEntityTp = (eType: string) => {
    kubeName(eType);
  };

  return (
    <div className="services__sidebar__body">
      <div className="resource__header">{'Select Resources'}</div>
      <div className="table__row--body">
        <div>
          {Object.keys(facetNames)
            .sort()
            .map((group) => (
              <FacetGroup key={group} group={group}>
                {facetNames[group].map((name) =>
                  typeof name.key === 'string' || name.key instanceof String ? (
                    <div
                      className={
                        activeKube === name.key
                          ? 'active__resource'
                          : 'kube_facet-group__button'
                      }
                      key={name.key}
                      onClick={() => setEntityTp(name.key)}
                    >
                      <div className="facet-picker__title__button__text">
                        <SiKubernetes size={14} style={{ marginRight: 20 }} />
                        {name.label}
                      </div>
                    </div>
                  ) : (
                    <div key={name}>
                      {Object.keys(name)
                        .sort()
                        .map((subgroup) => (
                          <FacetGroup key={subgroup} group={subgroup}>
                            {name[subgroup].map((fname) => (
                              <div
                                className={
                                  activeKube === fname.key
                                    ? 'active__resource'
                                    : 'kube_facet-group__button'
                                }
                                key={fname.key}
                                onClick={() => setEntityTp(fname.key)}
                              >
                                <SiKubernetes
                                  size={14}
                                  style={{ marginRight: 20 }}
                                />
                                {fname.label}
                              </div>
                            ))}
                          </FacetGroup>
                        ))}
                    </div>
                  ),
                )}
              </FacetGroup>
            ))}
        </div>
      </div>
    </div>
  );
};

export default KubernatesResources;
