import { ChipWithLabel, FacetPicker, IconWithLabel } from 'components';
import { iconsBySpanType } from 'constants';
import { useColorsByServiceName } from 'hooks';
import React, { useEffect, useState } from 'react';
import { kubeFacetCount } from 'requests';
import { DateSelection } from 'types';
import { useKubesState } from './hooks';
import {
  facet_cluster,
  facet_clusterrole,
  facet_clusterrolebinding,
  facet_cronjob,
  facet_daemonset,
  facet_deployment,
  facet_ingress,
  facet_job,
  facet_namespace,
  facet_node,
  facet_persistentvolume,
  facet_persistentvolumeclaim,
  facet_pod,
  facet_replicaset,
  facet_role,
  facet_rolebinding,
  facet_service,
  facet_serviceaccount,
  facet_statefulset,
} from './utils';

const getAttributesByName = (colorsByServiceName: {
  [key: string]: string;
}) => ({
  service_name: {
    forceExpanded: true,
    renderValue: (value: string) => (
      <ChipWithLabel color={colorsByServiceName[value]} label={value} />
    ),
  },
  span_type: {
    forceExpanded: true,
    renderValue: (value: string) => (
      <IconWithLabel icon={iconsBySpanType[value]} label={value} />
    ),
  },
});

type Props = {
  colorsByServiceName: ReturnType<typeof useColorsByServiceName>;
  date: DateSelection;
  entityType: string;
  kubesState: ReturnType<typeof useKubesState>;
};

const KubernatesSidebar = ({
  colorsByServiceName,
  date,
  entityType,
  kubesState,
}: Props) => {
  const [activeFacet, setActiveFacet] = useState([]);
  const { selectedFacetValuesByNameState } = kubesState;

  useEffect(() => {
    switch (entityType) {
      case 'Pod':
        return setActiveFacet(facet_pod);
      case 'Cluster':
        return setActiveFacet(facet_cluster);
      case 'Node':
        return setActiveFacet(facet_node);
      case 'Namespace':
        return setActiveFacet(facet_namespace);
      case 'Ingress':
        return setActiveFacet(facet_ingress);
      case 'Deployment':
        return setActiveFacet(facet_deployment);
      case 'Service':
        return setActiveFacet(facet_service);
      case 'ReplicaSet':
        return setActiveFacet(facet_replicaset);
      case 'PersistentVolumeClaim':
        return setActiveFacet(facet_persistentvolumeclaim);
      case 'Job':
        return setActiveFacet(facet_job);
      case 'PersistentVolume':
        return setActiveFacet(facet_persistentvolume);
      case 'CronJob':
        return setActiveFacet(facet_cronjob);
      case 'DaemonSet':
        return setActiveFacet(facet_daemonset);
      case 'StatefulSet':
        return setActiveFacet(facet_statefulset);
      case 'Role':
        return setActiveFacet(facet_role);
      case 'RoleBinding':
        return setActiveFacet(facet_rolebinding);
      case 'ClusterRole':
        return setActiveFacet(facet_clusterrole);
      case 'ClusterRoleBinding':
        return setActiveFacet(facet_clusterrolebinding);
      case 'ServiceAccount':
        return setActiveFacet(facet_serviceaccount);
    }
  }, [entityType]);

  const clearFacetHandler = (name: string) => () => {
    selectedFacetValuesByNameState.clearFacet(name);
  };

  const handlersByName = (name: string) => ({
    excludeFacetValue: (value: string) => {
      name = name.key;
      selectedFacetValuesByNameState.excludeFacetValue({ name, value });
    },
    selectOnlyFacetValue: (value: string) => {
      name = name.key;
      selectedFacetValuesByNameState.selectOnlyFacetValue({ name, value });
    },
    toggleFacetValue: (value: string) => {
      name = name.key;
      selectedFacetValuesByNameState.toggleFacetValue({ name, value });
    },
  });

  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  const requestByLabelName = (labelName: string) => () =>
    kubeFacetCount({
      entityType: entityType,
      tags: labelName.key,
      selectedFacetValuesByName: {
        ...selectedFacetValuesByNameState.state,
      },
      filterByFacets: kubesState.filterByFacets,
    });

  useEffect(() => {
    setLastRefreshedAt(new Date());
  }, [date, selectedFacetValuesByNameState.state]);

  return (
    <div key={activeFacet.length} className="cicd__sidebar">
      <div className="left-sidebar__section">
        {activeFacet?.map((group, index) => (
          <FacetPicker
            clearFacet={clearFacetHandler(group.key)}
            key={group.key}
            lastRefreshedAt={lastRefreshedAt}
            name={group.key}
            renderName={(s) =>
              s
                .replace(/_+/g, ' ')
                .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
                  return word.toUpperCase();
                })
                .replace(/\s+/g, ' ')
            }
            request={requestByLabelName(group)}
            selectedFacetValues={
              selectedFacetValuesByNameState.state[group.key] || {}
            }
            {...handlersByName(group)}
          />
        ))}
      </div>
    </div>
  );
};

export default KubernatesSidebar;
