import { usePopoverContext } from 'components';
import React, { ReactElement, useEffect, useRef } from 'react';
import { EventPageProps } from 'screens/Events/types';
import { ageCalculator } from 'utils/timeNs';
import { useKubesState } from './hooks';
import { getKubernetesRightSideBarDetailsRows } from './utils/KubernetesRightSideBarDetailsRows';
import useRequest from 'hooks/useRequest';
import kubeNamespaceCount from 'requests/kubeNamespaceCount';
import {
  getResult,
  includeSpecialCharacters,
  objectType,
  valueInsideArray,
} from './utils/kubernetesRightSideBarDetailsFunctions';

const KuberneteAttribute = ({
  onExcludeByAttribute,
  onFilterByAttribute,
  onReplaceFilterByAttribute,
  onCopyToClipboard,
  tag,
}: {
  onExcludeByAttribute: (tag: string) => void;
  onFilterByAttribute: (tag: string) => void;
  onReplaceFilterByAttribute: (tag: string) => void;
  onCopyToClipboard: (tag: string) => void;
  tag: string;
}) => {
  return (
    <div className="kubernetes__attribute__dropdown__panel">
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onFilterByAttribute(tag)}
      >
        Filter by {tag}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onExcludeByAttribute(tag)}
      >
        Exclude {tag}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onReplaceFilterByAttribute(tag)}
      >
        Replace filter with {tag}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onCopyToClipboard(tag)}
      >
        Copy to Clipboard
      </div>
    </div>
  );
};

const TagText = ({
  onTagClick,
  value,
  heading,
  valueInTags,
  entity,
  clickable,
  podCount,
  deploymentCount,
}: {
  onTagClick: (tag: string, tagRef: any, clickable: boolean) => void;
  value: string;
  heading: string;
  valueInTags: boolean;
  entity: any;
  clickable: boolean;
  podCount?: number;
  deploymentCount?: number;
}) => {
  const tagRef = useRef<HTMLDivElement>(null);
  const className = `kubernetes__table__details__message ${
    clickable ? 'clickable' : ''
  }`;
  const headingText = `kubernetes_heading_text ${
    clickable ? 'headingText' : ''
  }`;
  const subText = `kubernetes_heading_text ${clickable ? 'headingText' : ''}`;
  if (valueInTags) {
    const targetTag = entity.tags.find((tag) => tag.startsWith(value));
    return renderTag(targetTag);
  } else {
    switch (value) {
      case 'namespace-deployments':
        return renderTag(deploymentCount ?? '0');
      case 'namespace-pods':
        return renderTag(podCount ?? '0');
      case 'automountServiceAccountToken':
      case 'selectors':
        return renderTag('None');
      case 'secrets':
        const answer = entity?.secrets?.length;
        return renderTag(answer);
      default:
        if (value.includes('[0]')) {
          const answer = valueInsideArray(value, entity);
          return renderTag(answer);
        } else if (typeof entity[value] === 'object' && value !== null) {
          const answer = objectType(value, entity);
          return renderTag(answer);
        } else if (value.includes('creationTimestamp')) {
          const timestamp = entity.metadata[value];
          const answer = ageCalculator(timestamp);
          return renderTag(answer);
        } else if (value.includes('/')) {
          const result = includeSpecialCharacters(value, entity);
          return renderTag(result);
        } else if (value.length !== 0) {
          const result = getResult(value, entity);
          return renderTag(result);
        } else {
          return renderTag('-');
        }
    }
  }

  function fetchValue(answer) {
    if (answer) {
      if (clickable && answer.includes(':')) {
        answer = answer.split(':')[1];
      }
      if (answer && answer.length > 25) {
        return `${answer.substring(0, 20)}...`;
      } else {
        return answer;
      }
    }
  }
  function renderTag(answer) {
    if (answer) {
      return (
        <div
          className={className}
          onClick={(e) => {
            e.stopPropagation();
            onTagClick(answer, tagRef, clickable);
          }}
          ref={tagRef}
        >
          <div className={headingText}>
            <span className="kube__rightsidebar__text__overflow">
              {heading}
            </span>
          </div>
          <div className={subText}>
            <span className="kube__rightsidebar__text__overflow">
              {fetchValue(answer)}
            </span>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }
};

const KubernatesRightSideBarDetails = ({
  entity,
  entityType,
  kubeState,
  close,
}: {
  entity: any;
  entityType: string;
  kubeState: ReturnType<typeof useKubesState>;
  close: any;
} & EventPageProps): ReactElement => {
  const { setFilterByFacets } = kubeState;
  const popover = usePopoverContext();
  const podsCount = useRequest(kubeNamespaceCount);
  const deploymentsCount = useRequest(kubeNamespaceCount);

  const onFilterByAttribute = (attribute: string) => {
    const queryStr = attribute.replace(':', '=');
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${queryStr}`]: true,
      };
    });
    close();
    popover.close();
  };

  const onExcludeByAttribute = (attribute: string) => {
    const queryStr = attribute.replace(':', '!=');
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${queryStr}`]: true,
      };
    });
    close();
    popover.close();
  };
  const onReplaceFilterByAttribute = (attribute: string) => {
    const queryStr = attribute.replace(':', '=');
    setFilterByFacets(() => {
      return {
        [`${queryStr}`]: true,
      };
    });
    close();
    popover.close();
  };

  const onCopyToClipboard = (attribute: string) => {
    navigator.clipboard.writeText(attribute);
    popover.close();
  };

  const onTagClick = (tag: string, tagRef: any, clickable: boolean) => {
    if (clickable) {
      popover.open({
        component: KuberneteAttribute,
        element: tagRef.current,
        props: {
          tag,
          onExcludeByAttribute,
          onFilterByAttribute,
          onReplaceFilterByAttribute,
          onCopyToClipboard,
        },
        width: 400,
      });
    }
  };

  const rowDetails = getKubernetesRightSideBarDetailsRows()
    .find((row) => row.name === entityType)
    ?.formats.map((format) => ({
      key: format.key,
      value: format.value,
      clickable: format.clickable,
      tags: format.tags,
    }));

  const half =
    rowDetails.length > 5
      ? Math.ceil(rowDetails.length / 2)
      : rowDetails.length;
  const firstHalf = rowDetails.slice(0, half);
  const secondHalf = rowDetails.slice(half, rowDetails.length);

  useEffect(() => {
    if (entityType === 'Namespace') {
      podsCount.call({ entityType: 'Pod', groupKey: 'kube_namespace' });
      deploymentsCount.call({
        entityType: 'Deployment',
        groupKey: 'kube_namespace',
      });
    }
  }, [entityType]);

  const calculateCount = (result: any): number => {
    const entityName = entity.metadata.name;
    const count = result
      .filter(({ groupBys }) =>
        groupBys.some(({ value }) => value === entityName),
      )
      .map(({ count }) => count)
      .reduce((a, b) => a + b, 0);
    return count;
  };

  return (
    <div>
      <div className="kubernetes__table__message__labels">
        {firstHalf.map((label: any, index: number) => {
          const podCount = podsCount.result && calculateCount(podsCount.result);
          const deploymentCount =
            deploymentsCount.result && calculateCount(deploymentsCount.result);
          return (
            <TagText
              key={index}
              onTagClick={onTagClick}
              value={`${label.value}`}
              heading={`${label.key}`}
              valueInTags={label.tags}
              entity={entity}
              clickable={label.clickable}
              podCount={podCount}
              deploymentCount={deploymentCount}
            />
          );
        })}
      </div>
      <div className="kubernetes__table__message__labels">
        {secondHalf.map((label: any, index: number) => {
          return (
            <TagText
              key={index}
              onTagClick={onTagClick}
              value={`${label.value}`}
              heading={`${label.key}`}
              valueInTags={label.tags}
              entity={entity}
              clickable={label.clickable}
            />
          );
        })}
      </div>
    </div>
  );
};

export default KubernatesRightSideBarDetails;
