import React from 'react';

type Props = {
  configurationByFunctionName: { [key: string]: any };
  functionName: string;
};

const ServerlessRightSidebarConfiguration = ({
  configurationByFunctionName,
  functionName,
}: Props) => {
  const configuration = configurationByFunctionName[functionName];

  if (!configuration) {
    return null;
  }

  return (
    <div className="serverless__right-sidebar__configuration">
      {Object.keys(configuration).map((key) => (
        <div
          className="serverless__right-sidebar__configuration__item"
          key={key}
        >
          <div className="serverless__right-sidebar__configuration__item__key">
            {key}
          </div>
          <div className="serverless__right-sidebar__configuration__item__value">
            {JSON.stringify(configuration[key])}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServerlessRightSidebarConfiguration;
