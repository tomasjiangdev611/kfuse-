import classnames from 'classnames';
import { TooltipTrigger } from 'components';
import React, { MouseEvent, useLayoutEffect, useRef, useState } from 'react';
import { Input } from './Input';

enum State {
  EDITING = 'editing',
  IDLE = 'idle',
  SAVING = 'saving',
}

type Props = {
  save: (nextValue: string) => Promise<void>;
  text: string;
};

const EditableText = ({ save, text }: Props) => {
  const containerElementRef = useRef<HTMLSpanElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>(State.IDLE);
  const [value, setValue] = useState<string>(text);
  const [width, setWidth] = useState<number>(null);

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    setState(State.EDITING);
  };
  const onBlur = async () => {
    if (value !== text) {
      setState(State.SAVING);
      await save(value);
      setState(State.IDLE);
    } else {
      setState(State.IDLE);
    }
  };

  useLayoutEffect(() => {
    if (state === State.EDITING) {
      const inputElement = inputElementRef.current;
      if (inputElement) {
        const end = inputElement.value.length;
        inputElement.setSelectionRange(end, end);
        inputElement.focus();
      }
    }
  }, [state]);

  useLayoutEffect(() => {
    const containerElement = containerElementRef.current;
    if (containerElement) {
      setWidth(containerElement.offsetWidth);
    }
  }, []);

  return (
    <span
      className={classnames({
        'editable-text': true,
        [`editable-text--${state}`]: true,
      })}
      ref={containerElementRef}
    >
      <Input
        className="input--naked editable-text__input"
        onBlur={onBlur}
        onChange={setValue}
        onEnter={onBlur}
        ref={inputElementRef}
        style={width ? { width: `${width}px` } : {}}
        type="text"
        value={value}
      />
      <span className="editable-text__text" onClick={onClick}>
        {state === State.SAVING ? value : text}
      </span>
    </span>
  );
};

export default EditableText;
