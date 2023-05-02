import { useForm } from 'hooks';
import React, { ReactElement } from 'react';
import { X } from 'react-feather';
import { defaultWidget, Widget as WidgetType } from 'types';
import WidgetModalBody from '../WidgetModal/WidgetModalBody';

type Props = {
  onSave: (widget: WidgetType) => void;
  widget?: WidgetType;
};

const WidgetsForm = ({ onSave, widget }: Props): ReactElement => {
  const form = useForm(widget || defaultWidget);

  const submit = () => {
    onSave(form.values);
  };

  return (
    <div className="widgets__form">
      <div className="widgets__form__body">
        <WidgetModalBody form={form} />
      </div>
      <div className="widgets__form__footer">
        <button
          className="widgets__form__footer__button button button--blue"
          onClick={submit}
        >
          Add to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WidgetsForm;
