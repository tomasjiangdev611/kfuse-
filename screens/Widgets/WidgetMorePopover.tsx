import { PopoverTrigger, useModalsContext } from 'components';
import React, { ReactElement } from 'react';
import { Edit, MoreVertical, X } from 'react-feather';
import { Widget as WidgetType } from 'types';
import WidgetModal from '../WidgetModal';

type Props = {
  editWidget: (widget: WidgetType) => void;
  removeWidget: () => void;
  widget: WidgetType;
};

const WidgetMorePopover = ({
  editWidget,
  removeWidget,
  widget,
}: Props): ReactElement => {
  const modals = useModalsContext();

  const editWidgetHandler = (close: () => void) => () => {
    modals.push(<WidgetModal onSave={editWidget} widget={widget} />);
    close();
  };

  const removeWidgetHandler = (close: () => void) => () => {
    removeWidget();
    close();
  };

  return (
    <PopoverTrigger
      className="widget__more-popover"
      component={({ close }) => (
        <>
          <button
            className="popover__panel__item"
            onClick={editWidgetHandler(close)}
          >
            <Edit className="popover__panel__item__icon" size={16} />
            Edit Widget
          </button>
          <button
            className="popover__panel__item"
            onClick={removeWidgetHandler(close)}
          >
            <X className="popover__panel__item__icon" size={16} />
            Remove Widget
          </button>
        </>
      )}
      right
    >
      <MoreVertical size={14} />
    </PopoverTrigger>
  );
};

export default WidgetMorePopover;
