import { ChipWithLabel, SelectV2 } from 'components';
import { useForm } from 'hooks';
import React, { useMemo } from 'react';
import { Span, TraceMetrics } from 'types';

const options = [
  { label: 'Service', value: 'service' },
  { label: 'Host', value: 'hostname' },
];

const typeOptions = [
  { label: 'Exec time %', value: 'execTime' },
  { label: 'Span Count', value: 'spanCount' },
];

type Props = {
  colorMap: { [key: string]: string };
  form: ReturnType<typeof useForm>;
  spans: Span[];
  traceMetrics: TraceMetrics;
};

type Item = {
  name: string;
  value: string;
};

type Args = {
  attribute: string;
  spans: Span[];
  traceMetrics: TraceMetrics;
  type: string;
};

const getItems = ({ attribute, spans, traceMetrics, type }: Args): Item[] => {
  const { hostExecTime, serviceExecTime } = traceMetrics;

  if (type === 'execTime') {
    const execTime = attribute === 'service' ? serviceExecTime : hostExecTime;

    const total: number = Object.values(
      execTime as { [key: string]: number },
    ).reduce((sum: number, execTime: number) => sum + execTime, 0);

    return Object.keys(execTime)
      .sort((a, b) => execTime[b] - execTime[a])
      .map((property) => ({
        name: property,
        value: `${((execTime[property] / total) * 100).toFixed(1)}%`,
      }));
  }

  const spanCountProperty: { [key: string]: number } = {};

  spans.forEach((span) => {
    const { attributes, serviceName } = span;
    const { hostname } = attributes;

    const property = attribute === 'service' ? serviceName : hostname;

    if (!spanCountProperty[property]) {
      spanCountProperty[property] = 0;
    }

    spanCountProperty[property] += 1;
  });

  return Object.keys(spanCountProperty)
    .sort((a, b) => spanCountProperty[b] - spanCountProperty[a])
    .map((property) => ({
      name: property,
      value: String(spanCountProperty[property]),
    }));
};

const TraceSidebarExecTime = ({
  colorMap,
  form,
  spans,
  traceMetrics,
}: Props) => {
  const items = useMemo(
    () =>
      getItems({
        attribute: form.values.attribute,
        spans,
        traceMetrics,
        type: form.values.type,
      }),
    [spans, traceMetrics, form.values],
  );

  return (
    <div className="trace-sidebar__exec-time">
      <div className="trace-sidebar__exec-time__header">
        <div className="trace-sidebar__exec-time__header__left">
          <SelectV2.Select
            className="select--inline select--small select--naked"
            options={options}
            {...form.propsByKey('attribute')}
          />
        </div>
        <div className="trace-sidebar__exec-time__header__right">
          <SelectV2.Select
            className="select--inline select--small select--naked"
            options={typeOptions}
            {...form.propsByKey('type')}
          />
        </div>
      </div>
      <div className="trace-sidebar__exec-time__body">
        {items.map((item) => (
          <div className="trace-sidebar__exec-time__body__item" key={item.name}>
            <div className="trace-sidebar__exec-time__body__item__label">
              <ChipWithLabel color={colorMap[item.name]} label={item.name} />
            </div>
            <div className="trace-sidebar__exec-time__body__item__value">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraceSidebarExecTime;
