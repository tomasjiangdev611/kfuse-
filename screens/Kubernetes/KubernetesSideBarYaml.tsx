import React from 'react';
import JSONTree from 'react-json-tree';
import * as yaml from 'js-yaml';
import { entityMapping } from './KubernetesRightSideBar';
import { monokai } from './utils';

type Props = {
  entityType: any;
  kpisByFunctionName: any;
};
function convertYamlToJson(yamlString: any) {
  try {
    return yaml.load(yamlString);
  } catch (e) {
    return e;
  }
}

const KubernetesSideBarYaml = ({ entityType, kpisByFunctionName }: Props) => {
  const yamlData = kpisByFunctionName;
  const yamlValue =
    yamlData && yamlData.length > 0
      ? yamlData[0][entityMapping[entityType]].yaml
      : '';
  return (
    <div className="kubernetes-sidebar__yaml__head">
      <div className="kubernetes-sidebar__yaml__subhead">
        <div className="kubernetes-sidebar__yaml__subhead__tree">
          <JSONTree
            data={convertYamlToJson(yamlValue)}
            labelRenderer={(raw) => <strong>{raw[0]}</strong>}
            hideRoot
            invertTheme
            theme={{
              extend: monokai,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KubernetesSideBarYaml;
