import { useToggle } from 'hooks';
import React from 'react';
import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';
import { PanelPosition } from 'types';
import { copyToClipboard } from 'utils';
import { TooltipTrigger } from './TooltipTrigger';

type Props = {
  offsetX?: number;
  offsetY?: number;
  text: string;
  tooltipPosition?: PanelPosition;
};

const CopyButton = ({
  offsetX = 0,
  offsetY = 0,
  text,
  tooltipPosition = PanelPosition.Top,
}: Props) => {
  const copy = () => {
    copyToClipboard(text);
    hasCopiedToggle.on();
  };

  const hasCopiedToggle = useToggle();
  return (
    <TooltipTrigger
      className="copy-button"
      offsetX={offsetX}
      offsetY={offsetY}
      position={tooltipPosition}
      tooltip={hasCopiedToggle.value ? 'Copied!' : 'Copy'}
    >
      <button className="logs__sheet__tooltip__button" onClick={copy}>
        {hasCopiedToggle.value ? (
          <HiOutlineClipboardDocumentCheck size={19} />
        ) : (
          <HiOutlineClipboardDocumentList size={19} />
        )}
      </button>
    </TooltipTrigger>
  );
};

export default CopyButton;
