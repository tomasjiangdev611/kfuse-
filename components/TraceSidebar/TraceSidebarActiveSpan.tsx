import React from 'react';
import JSONTree from 'react-json-tree';
import { Span } from 'types';
import TraceSidebarLatencyTooltip from './TraceSidebarLatencyTooltip';
import useLatencyRanks from './useLatencyRanks';

const getAttributeSections = (attributes) => {
  const keys = Object.keys(attributes);
  const result = [];

  for (let i = 0; i < keys.length; i += 2) {
    const items = keys
      .slice(i, i + 2)
      .map((key) => ({ label: key, value: attributes[key] }));
    if (items.length < 2) {
      items.push(null);
    }

    result.push(items);
  }

  return result;
};

type Props = {
  span: Span;
};

const monokai = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const TraceSidebarActiveSpan = ({ span }: Props) => {
  return (
    <div className="trace-sidebar__active-span">
      <div className="trace-sidebar__active-span__header">
        <div className="trace-sidebar__active-span__header__left text--h3">
          {span.name}
        </div>
        <div className="trace-sidebar__active-span__header__right">
          <TraceSidebarLatencyTooltip label="span" span={span} />
        </div>
      </div>
      <div className="trace-sidebar__active-span__body">
        <div className="trace-sidebar__active-span__attributes">
          <JSONTree
            data={span}
            labelRenderer={(raw) => <strong>{raw[0]}</strong>}
            getItemString={() => <span />}
            hideRoot
            invertTheme
            shouldExpandNode={(keyPath) =>
              keyPath && keyPath.length && keyPath[0] === 'attributes'
            }
            theme={{
              extend: monokai,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TraceSidebarActiveSpan;
