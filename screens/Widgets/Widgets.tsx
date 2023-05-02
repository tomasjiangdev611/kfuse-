import { useModalsContext } from 'components';
import React, { ReactElement, useEffect } from 'react';
import { Plus } from 'react-feather';
import { Widget as WidgetType } from 'types';
import useWidgets from './useWidgets';
import Widget from './Widget';
import WidgetModal from '../WidgetModal';
import WidgetsForm from './WidgetsForm';

const Widgets = (): ReactElement => {
  const modals = useModalsContext();
  const widgets = useWidgets();

  const editWidgetHandler =
    (rowIndex: number, widgetIndex: number) => (widget: WidgetType) => {
      widgets.editWidget(rowIndex, widgetIndex, widget);
    };

  const removeWidgetHandler = (rowIndex: number, widgetIndex: number) => () => {
    widgets.removeWidget(rowIndex, widgetIndex);
  };

  const showAddWidgetToNewRowModal = () => {
    modals.push(<WidgetModal onSave={widgets.addWidgetToNewRow} />);
  };

  const showAddWidgetToRowModalHandler = (rowIndex: number) => () => {
    modals.push(
      <WidgetModal
        onSave={(widget) => widgets.addWidgetToRow(rowIndex, widget)}
      />,
    );
  };

  useEffect(() => {
    widgets.load();
  }, []);

  return (
    <div className="widgets">
      {widgets.rows.length ? (
        <>
          {widgets.rows.map((row, i) => (
            <div className="widgets__row">
              {row.map((widget, j) => (
                <Widget
                  editWidget={editWidgetHandler(i, j)}
                  removeWidget={removeWidgetHandler(i, j)}
                  widget={widget}
                />
              ))}
              <button
                className="widgets__add-widget-button"
                onClick={showAddWidgetToRowModalHandler(i)}
              >
                <Plus className="widgets__add-widget-button__icon" size={20} />
              </button>
            </div>
          ))}
          <div className="widgets__row">
            <button
              className="widgets__add-widget-button widgets__add-widget-button--new-row"
              onClick={showAddWidgetToNewRowModal}
            >
              <Plus className="widgets__add-widget-button__icon" size={20} />
            </button>
          </div>
        </>
      ) : (
        <WidgetsForm onSave={widgets.addWidgetToNewRow} />
      )}
    </div>
  );
};

export default Widgets;
