import { useDateState } from 'hooks';
import { useState } from 'react';
import { DateSelection } from 'types/DateSelection';

import { DashboardPanelProps } from '../types';

const useDashboardModalState = (date: DateSelection) => {
  const [modalDate, setModalDate] = useDateState(date);
  const [panelData, setPanelData] = useState<DashboardPanelProps | null>({
    title: '',
    type: 'timeseries',
    gridPos: { i: 'a', x: 0, y: 0, w: 4, h: 3 },
  });

  const updatePanelAnnotation = (propertyKey: string, value: any) => {
    setPanelData((prevPanelData) => {
      return {
        ...prevPanelData,
        [propertyKey]: value,
      };
    });
  };

  return {
    modalDate,
    panelData,
    setModalDate,
    setPanelData,
    updatePanelAnnotation,
  };
};

export default useDashboardModalState;
