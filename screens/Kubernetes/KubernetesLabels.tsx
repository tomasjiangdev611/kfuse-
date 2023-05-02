import { usePopoverContext } from 'components';
import React, { ReactElement, useState, useRef } from 'react';
import { EventPageProps } from 'screens/Events/types';
import { useKubesState } from './hooks';

const MAX_LABELS = 8;

const KuberneteLabel = ({
  onExcludeByLabel,
  onFilterByLabel,
  onReplaceFilterByLabel,
  onCopyToClipboard,
  label,
}: {
  onExcludeByLabel: (label: string) => void;
  onFilterByLabel: (label: string) => void;
  onReplaceFilterByLabel: (label: string) => void;
  onCopyToClipboard: (label: string) => void;
  label: string;
}) => {
  return (
    <div className="kubernetes__attribute__dropdown">
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onFilterByLabel(label)}
      >
        Filter by {label}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onExcludeByLabel(label)}
      >
        Exclude {label}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onReplaceFilterByLabel(label)}
      >
        Replace filter with {label}
      </div>
      <div
        className="kubernetes__attribute__dropdown__item"
        onClick={() => onCopyToClipboard(label)}
      >
        Copy to Clipboard
      </div>
    </div>
  );
};

const LabelText = ({
  onLabelClick,
  label,
}: {
  onLabelClick: (label: string, labelRef: any) => void;
  label: string;
}) => {
  const labelRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="chip chip--blue kubernetes__table__message__labels__chip"
      onClick={(e) => {
        e.stopPropagation();
        onLabelClick(label, labelRef);
      }}
      ref={labelRef}
    >
      {label}
    </div>
  );
};

const KubernetesLabels = ({
  row,
  kubeState,
  close,
}: {
  row: Record<string, any>;
  close: VoidFunction;
  kubeState: ReturnType<typeof useKubesState>;
} & EventPageProps): ReactElement => {
  const popover = usePopoverContext();
  const [showAll, setShowAll] = useState(false);
  const { labels } = row.metadata;
  const labelsLength = labels?.length;
  const trimmerdLabels =
    labelsLength > MAX_LABELS ? labels.slice(0, MAX_LABELS) : labels;
  const leftLabels =
    labelsLength > MAX_LABELS ? labels.slice(MAX_LABELS, labelsLength) : [];
  const { setFilterByFacets } = kubeState;

  const onFilterByLabel = (label: string) => {
    const queryStr = label.replace(':', '=');
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${queryStr}`]: 'LABEL',
      };
    });
    close();
    popover.close();
  };

  const onExcludeByLabel = (label: string) => {
    const queryStr = label.replace(':', '!=');
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${queryStr}`]: 'LABEL',
      };
    });
    close();
    popover.close();
  };
  const onReplaceFilterByLabel = (label: string) => {
    const queryStr = label.replace(':', '=');
    setFilterByFacets(() => {
      return {
        [`${queryStr}`]: 'LABEL',
      };
    });
    close();
    popover.close();
  };

  const onCopyToClipboard = (label: string) => {
    navigator.clipboard.writeText(label);
    popover.close();
  };

  const onLabelClick = (label: string, labelRef: any) => {
    popover.open({
      component: KuberneteLabel,
      element: labelRef.current,
      props: {
        label,
        onExcludeByLabel,
        onFilterByLabel,
        onReplaceFilterByLabel,
        onCopyToClipboard,
      },
      width: 400,
    });
  };

  return (
    <div className="kubernetes__table__message__labels__chip">
      {trimmerdLabels?.map((label: any, index: number) => {
        return (
          <LabelText
            key={index}
            onLabelClick={onLabelClick}
            label={`${label}`}
          />
        );
      }) || ''}
      {(showAll &&
        leftLabels?.map((label: any, index: number) => {
          return (
            <LabelText
              key={index}
              onLabelClick={onLabelClick}
              label={`${label}`}
            />
          );
        })) ||
        ''}
      {labelsLength > MAX_LABELS && (
        <div
          key={`${labelsLength - MAX_LABELS} more`}
          className="chip chip--blue"
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(!showAll);
          }}
        >
          {showAll ? 'Show less' : `${labelsLength - MAX_LABELS} more`}
        </div>
      )}
    </div>
  );
};

export default KubernetesLabels;
