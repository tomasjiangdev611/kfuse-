import React, { ReactElement, ReactNode } from 'react';
import { useModalsContext } from './context';

const Modals = (): ReactElement => {
  const { pop, stack } = useModalsContext();

  if (stack.length) {
    return (
      <div className="modals">
        {stack.length ? <button className="modals__bg" onClick={pop} /> : null}
        {stack.map((component: ReactNode) => component)}
      </div>
    );
  }

  return null;
};

export default Modals;
