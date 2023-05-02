import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  label: ReactNode;
};

const Tab = ({ children }: Props) => children;

export default Tab;
