import React from 'react';
import { useParams } from 'react-router-dom';
import { TracesTab } from 'types';
import Traces from './Traces';

const TracesContainer = () => {
  const { tab } = useParams();
  return <Traces tracesTab={(tab as TracesTab) || TracesTab.list} />;
};

export default TracesContainer;
