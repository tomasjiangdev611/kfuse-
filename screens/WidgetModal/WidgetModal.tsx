import { useModalsContext } from 'components';
import { useForm } from 'hooks';
import React, { ReactElement } from 'react';
import { X } from 'react-feather';
import { defaultWidget, Widget as WidgetType } from 'types';
import WidgetModalBody from './WidgetModalBody';

type Props = {
  onSave: (widget: WidgetType) => void;
  widget?: WidgetType;
};

const WidgetModal = ({ onSave, widget }: Props): ReactElement => {
  const form = useForm(widget || defaultWidget);

  const modals = useModalsContext();

  const submit = () => {
    onSave(form.values);
    modals.pop();
  };

  return (
    <div className="modal modal--large">
      <div className="modal__header">
        <div className="modal__header__text">{`${
          widget ? 'Edit' : 'Create'
        } Widget`}</div>
        <button className="modal__header__close" onClick={modals.pop}>
          <X />
        </button>
      </div>
      <div className="modal__body widget-modal__body">
        <WidgetModalBody form={form} />
      </div>
      <div className="modal__footer">
        <button className="modal__footer__button button" onClick={modals.pop}>
          Cancel
        </button>
        <button
          className="modal__footer__button button button--primary"
          onClick={submit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default WidgetModal;
