import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Modal = ({ children }: Props) => {
  return { children };
};

export default Modal;
