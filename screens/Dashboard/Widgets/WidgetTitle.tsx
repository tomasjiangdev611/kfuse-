import { Input } from 'components/Input';
import React, { ReactElement } from 'react';
import { useDashboardModalState } from '../hooks';

const WidgetTitle = ({
  dashboardModalState,
}: {
  dashboardModalState: ReturnType<typeof useDashboardModalState>;
}): ReactElement => {
  const { panelData, updatePanelAnnotation } = dashboardModalState;

  return (
    <div>
      <Input
        placeholder="Give chart a name"
        onChange={(val) => {
          updatePanelAnnotation('title', val);
        }}
        type="text"
        value={panelData.title}
      />
    </div>
  );
};

export default WidgetTitle;
