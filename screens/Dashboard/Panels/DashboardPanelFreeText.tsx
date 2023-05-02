import React, { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';

import { DashboardPanelComponentProps } from '../types';

const DashboardPanelFreeText = ({
  panel,
}: DashboardPanelComponentProps): ReactElement => {
  const { options } = panel;

  return (
    <div>
      {options && (
        <>
          {options.mode === 'markdown' && (
            <ReactMarkdown className="dashboard-panel__free-text">
              {options.content}
            </ReactMarkdown>
          )}
          {options.mode === 'html' && (
            <div
              className="dashboard-panel__free-text"
              dangerouslySetInnerHTML={{ __html: options.content }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPanelFreeText;
