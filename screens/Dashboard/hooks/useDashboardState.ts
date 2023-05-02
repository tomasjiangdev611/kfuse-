import { useModalsContext } from 'components';
import { useDateState, useToggle } from 'hooks';
import { useState } from 'react';
import { Layout } from 'react-grid-layout';
import { DateSelection } from 'types/DateSelection';

import {
  DashboardProps,
  DashboardPanelProps,
  DashboardPanelTargetsProps,
  DashboardPanelType,
  DashboardReloadPanelsProps,
} from '../types';
import {
  getLargestYAxisValue,
  getReloadPanels,
  isDragItemPlaceholder,
  transformPanels,
} from '../utils';

const AddPanelPlaceholder: DashboardPanelProps = {
  gridPos: { i: 'a', x: 0, y: 0, w: 6, h: 3, minW: 1, minH: 2 },
  title: 'Add Panel',
  type: DashboardPanelType.PLACEHOLDER,
};

const useDashboardState = () => {
  const [date, setDate] = useDateState();
  const [dashboardDetails, setDashboardDetails] = useState<DashboardProps>({
    description: '',
    time: { from: 'now-5m', to: 'now' },
    title: `New Dashboard ${new Date().toLocaleDateString()}`,
  });
  const [dragItemSize, setDragItemSize] = useState({ w: 3, h: 2 });
  const [selectedPanel, setSelectedPanel] = useState<{
    nestedIndex: string;
    panelIndex: number;
  }>({
    nestedIndex: null,
    panelIndex: null,
  });
  const isRightSidebarOpenToggle = useToggle(false);
  const panelSetupModal = useModalsContext();
  const [panels, setPanels] = useState<DashboardPanelProps[]>([]);
  const [reloadPanels, setReloadPanels] = useState<DashboardReloadPanelsProps>(
    {},
  );

  const initialDashboardSetup = (dashboard: any) => {
    const { description, panels, title, time } = dashboard;
    setDashboardDetails((prevState) => {
      return { ...prevState, description, title, time };
    });

    const transformedPanels = transformPanels(panels);
    setReloadPanels(getReloadPanels(transformedPanels, {}));

    setPanels(transformedPanels);
  };

  const addPanel = (panelData: DashboardPanelProps, nestedIndex: string) => {
    setPanels((prevPanels) => {
      const newPanels = [...prevPanels];
      const newReloadPanels: DashboardReloadPanelsProps = {};
      if (nestedIndex) {
        const nestedIndexNumber = Number(nestedIndex);
        newPanels[nestedIndexNumber].panels.push(panelData);
        const panelId = newPanels[nestedIndexNumber].panels.length - 1;
        newReloadPanels[nestedIndex][`${panelId}`] = true;
      } else {
        newPanels.push(panelData);
        const panelId = newPanels.length - 1;
        newReloadPanels[`${panelId}`] = true;
      }

      const placeholderIndex = prevPanels.findIndex(
        (panel) => panel.type === 'placeholder',
      );

      if (placeholderIndex !== -1) {
        newPanels.splice(placeholderIndex, 1);
      }

      if (placeholderIndex === -1) {
        const newY = getLargestYAxisValue(newPanels);
        AddPanelPlaceholder.gridPos.y = newY + 4;
        newPanels.push(AddPanelPlaceholder);
      }

      setReloadPanels(newReloadPanels);
      return newPanels;
    });
    isRightSidebarOpenToggle.off();
  };

  const updateMetricPanel = (
    panelIndex: number,
    targets: DashboardPanelTargetsProps[],
  ) => {
    setPanels((prevPanels) => {
      const newPanels = [...prevPanels];
      newPanels[panelIndex].targets = targets;
      return newPanels;
    });
  };

  const deletePanel = (panelIndex: number) => {
    setPanels((prevPanels) => {
      const newPanels = [...prevPanels];
      newPanels.splice(panelIndex, 1);
      if (newPanels.length === 0) {
        newPanels.push(AddPanelPlaceholder);
      }
      return newPanels;
    });
  };

  const updateLayoutChanges = (layouts: Layout[], nestedIndex: string) => {
    if (isDragItemPlaceholder(layouts)) {
      return;
    }
    setPanels((prevPanels) => {
      const newPanels = [...prevPanels];
      let layoutPanels = newPanels;
      if (nestedIndex) {
        layoutPanels = newPanels[Number(nestedIndex)].panels;
      }
      layouts.forEach((layout) => {
        const panelIndex = Number(layout.i);
        const pl = layoutPanels[panelIndex];
        const newGridPos = {
          ...pl.gridPos,
          ...{ x: layout.x, y: layout.y, w: layout.w, h: layout.h },
        };
        layoutPanels[panelIndex].gridPos = newGridPos;
      });

      if (nestedIndex) {
        newPanels[Number(nestedIndex)].panels = layoutPanels;
      }
      return newPanels;
    });
  };

  const updateSelectedPanel = (panelIndex: number, nestedIndex: string) => {
    if (
      panelIndex === selectedPanel.panelIndex &&
      nestedIndex === selectedPanel.nestedIndex
    ) {
      setSelectedPanel({ nestedIndex: null, panelIndex: null });
      return;
    }
    if (nestedIndex) {
      setSelectedPanel({ nestedIndex, panelIndex });
    } else {
      setSelectedPanel({ nestedIndex: null, panelIndex });
    }
  };

  const removePlaceholder = () => {
    setPanels((prevPanels) => {
      const newPanels = [...prevPanels];
      const placeholderIndex = newPanels.findIndex(
        (panel) => panel.type === 'placeholder',
      );
      if (placeholderIndex !== -1) {
        newPanels.splice(placeholderIndex, 1);
      }

      return newPanels;
    });
  };

  const addPlaceholder = () => {
    setPanels((prevPanels) => {
      const newPanels = [...prevPanels];
      const placeholderIndex = newPanels.findIndex(
        (panel) => panel.type === 'placeholder',
      );

      if (placeholderIndex === -1) {
        const newY = getLargestYAxisValue(newPanels);
        AddPanelPlaceholder.gridPos.y = newY + 4;
        newPanels.push(AddPanelPlaceholder);
      }
      return newPanels;
    });
  };

  const updatePanel = (
    panelIndex: number,
    nestedIndex: number,
    propertyKey: string,
    value: any,
  ) => {
    setPanels((prevPanels) => {
      const newPanels = [...prevPanels];
      if (nestedIndex) {
        newPanels[nestedIndex].panels[panelIndex][propertyKey] = value;
      } else {
        newPanels[panelIndex][propertyKey] = value;
      }
      return newPanels;
    });
  };

  const onDateChange = (date: DateSelection) => {
    setReloadPanels(getReloadPanels(panels, {}));
    setDate(date);
  };

  return {
    addPanel,
    addPlaceholder,
    date,
    dashboardDetails,
    deletePanel,
    dragItemSize,
    initialDashboardSetup,
    isRightSidebarOpenToggle,
    onDateChange,
    panels,
    panelSetupModal,
    removePlaceholder,
    reloadPanels,
    selectedPanel,
    setDashboardDetails,
    setDragItemSize,
    setPanels,
    setReloadPanels,
    updateLayoutChanges,
    updateMetricPanel,
    updatePanel,
    updateSelectedPanel,
  };
};

export default useDashboardState;
