import {
  LeftSidebar,
  Loader,
  TooltipTrigger,
  useLeftSidebarState,
} from 'components';
import { Pagination } from 'components';
import colorsByAlertState from 'constants/colorsByAlertState';
import { useDateState, useRequest } from 'hooks';
import React, { useState, useEffect, ReactElement } from 'react';
import { Maximize2, RefreshCw } from 'react-feather';
import { PanelPosition, SortOrder } from 'types';
import { kubeEntities, kubeNamespaceCount } from 'requests';
import { useKubesState } from './hooks';
import KubernatesResources from './KubernetesResources';
import KubernetesRightSideBar from './KubernetesRightSideBar';
import KubernetesSearch from './KubernetesSearch';
import KubernatesSidebar from './KubernetesSidebar';
import KubernatesTable from './KubernetesTable';

const Kubernates = (): ReactElement => {
  const params = new URLSearchParams(window.location.hash.substr(1));
  const paramEntity = params.get('/kubernetes?entity');
  const paramActiveKube = params.get('activeKube');
  const [activeKube, setActiveKube] = useState(
    paramActiveKube ? JSON.parse(paramActiveKube) : null,
  );
  const [date, setDate] = useDateState();
  const leftSidebarState = useLeftSidebarState('kubernetes');
  const colorsByFunctionName = colorsByAlertState;
  const [entityType, setEntityType] = useState(
    paramEntity ? paramEntity : 'Pod',
  );
  const kubesState = useKubesState(entityType);
  const kubeEntitiesRequest = useRequest(kubeEntities);
  const kubeEntitiesCountRequest = useRequest(kubeNamespaceCount);
  const [isRefresh, setIsRefresh] = useState(true);
  const [sortBy, setSortBy] = useState({ key: '', type: '' });
  const [sortOrder, setSortOrder] = useState();
  const [page, setPage] = useState(1);
  const pageLimit = 50;
  useEffect(() => {
    kubeEntitiesRequest.call({
      entityType: entityType,
      sortBy: sortBy,
      sortOrder: sortOrder,
      offset: (page - 1) * pageLimit,
      pageLimit: pageLimit,
      filterByFacets: kubesState.filterByFacets,
      selectedFacetValuesByName:
        kubesState.selectedFacetValuesByNameState.state,
    });
    kubeEntitiesCountRequest.call({
      entityType: entityType,
      filterByFacets: kubesState.filterByFacets,
      selectedFacetValuesByName:
        kubesState.selectedFacetValuesByNameState.state,
    });
    setIsRefresh(false);
  }, [
    entityType,
    page,
    kubesState.selectedFacetValuesByNameState.state,
    kubesState.filterByFacets,
    isRefresh === true,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setPage(1);
    setSortBy(undefined);
    setSortOrder(undefined);
  }, [entityType, isRefresh === true]);

  const onRefresh = () => {
    setIsRefresh(true);
  };

  const getPageCountDetails = () => {
    const offset = page * pageLimit;
    if (
      kubeEntitiesCountRequest.result &&
      kubeEntitiesCountRequest.result[0].count !== 0
    ) {
      if (kubeEntitiesCountRequest.result[0].count < offset) {
        return (
          (page - 1) * pageLimit +
          1 +
          ' to ' +
          kubeEntitiesCountRequest.result[0].count
        );
      } else {
        return (page - 1) * pageLimit + 1 + ' to ' + offset;
      }
    } else {
      return 0;
    }
  };

  return (
    <div className="services">
      <LeftSidebar leftSidebarState={leftSidebarState}>
        <KubernatesResources activeKube={entityType} kubeName={setEntityType} />
        <KubernatesSidebar
          colorsByServiceName={colorsByFunctionName}
          date={date}
          key={entityType}
          entityType={entityType}
          kubesState={kubesState}
        />
      </LeftSidebar>
      <div className="services__main">
        <div className="services__header">
          <div className="services__header__left">
            {leftSidebarState.width === 0 ? (
              <TooltipTrigger
                className="logs__search__show-filters-button"
                position={PanelPosition.TOP_LEFT}
                tooltip="Show Filters"
              >
                <button
                  className="button button--icon"
                  onClick={leftSidebarState.show}
                >
                  <Maximize2 size={12} />
                </button>
              </TooltipTrigger>
            ) : null}
            <div className="kube__search-bar__body button-group ">
              <KubernetesSearch kubesState={kubesState} />
            </div>
          </div>
          <div className="cicd__header__right">
            <button className="date-controls__button" onClick={onRefresh}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        <div className="services__body">
          <Loader
            className="cicd__table"
            isLoading={kubeEntitiesRequest.isLoading}
          >
            <div className="kube__pagecount__header">
              {' '}
              Showing {getPageCountDetails()} of{' '}
              {kubeEntitiesCountRequest.result
                ? kubeEntitiesCountRequest.result[0].count
                : 0}{' '}
              {entityType}s{' '}
            </div>
            <KubernatesTable
              colorsByFunctionName={colorsByFunctionName}
              entityType={entityType}
              kpisByFunctionName={kubeEntitiesRequest.result || {}}
              setActiveKube={setActiveKube}
              setEntityType={setEntityType}
              kubesState={kubesState}
              setSortBy={setSortBy}
              setSortOrder={setSortOrder}
            />
            <div className="kube__pagecount__panel__left">
              <Pagination
                currentPage={page}
                pages={
                  kubeEntitiesCountRequest.result
                    ? kubeEntitiesCountRequest.result[0].count
                    : 0
                }
                setPage={setPage}
                pageLimit={pageLimit}
              />
            </div>
            {activeKube && (
              <KubernetesRightSideBar
                activeKube={activeKube}
                entityType={entityType}
                close={() => setActiveKube(null)}
                colorsByFunctionName={colorsByFunctionName}
                date={date}
                setEntityType={setEntityType}
                kpisByFunctionName={kubeEntitiesRequest.result || {}}
                kubeState={kubesState}
              />
            )}
          </Loader>
        </div>
      </div>
    </div>
  );
};

export default Kubernates;
