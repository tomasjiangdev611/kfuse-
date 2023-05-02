import { Picker, PickerTile, Select } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import {
  AiOutlineBarChart,
  AiOutlineDotChart,
  AiOutlineLineChart,
  AiOutlinePieChart,
} from 'react-icons/ai';
import { promqlMetadata } from 'requests';
import {
  SecondsFromNow,
  SecondsFromNowLabels,
  SecondsFromNowValues,
  WidgetTypes,
} from 'types';
import { WidgetTimeseries } from '../Widgets';
import MetricsPicker from '../MetricsPicker';

const secondsFromNowOptions = Object.keys(SecondsFromNow).map(
  (secondsFromNow) => ({
    label: SecondsFromNowLabels[secondsFromNow],
    value: SecondsFromNowValues[secondsFromNow],
  }),
);

const visualizationOptions = [
  {
    label: (
      <PickerTile icon={<AiOutlineBarChart size={20} />} label="Distribution" />
    ),
    value: WidgetTypes.Distribution,
  },
  {
    label: <PickerTile icon={<AiOutlinePieChart size={20} />} label="Pie" />,
    value: WidgetTypes.Pie,
  },
  {
    label: (
      <PickerTile icon={<AiOutlineDotChart size={20} />} label="Scatter" />
    ),
    value: WidgetTypes.Scatter,
  },
  {
    label: (
      <PickerTile icon={<AiOutlineLineChart size={20} />} label="Timeseries" />
    ),
    value: WidgetTypes.Timeseries,
  },
];

const WidgetModalBody = ({ form }) => {
  const promqlMetadataRequest = useRequest(promqlMetadata);
  const { propsByKey } = form;

  useEffect(() => {
    promqlMetadataRequest.call();
  }, []);
  return (
    <>
      <div className="widget-modal__time">
        <div className="widget-modal__time__select">
          <Select
            options={secondsFromNowOptions}
            placeholder="Time period"
            {...propsByKey('secondsFromNow')}
          />
        </div>
      </div>
      <div className="widget-modal__sections">
        <div className="widget-modal__section">
          <div className="widget-modal__section__header">
            <div className="widget-modal__section__header__text">Metrics</div>
          </div>
          <div className="widget-modal__section__body">
            <MetricsPicker
              formulaInput={propsByKey('formula')}
              metricsInput={propsByKey('metrics')}
              metrics={promqlMetadataRequest.result || []}
            />
          </div>
        </div>
        <div className="widget-modal__section">
          <div className="widget-modal__section__header">
            <div className="widget-modal__section__header__text">
              Visualization
            </div>
          </div>
          <div className="widget-modal__section__body">
            <div className="widget-modal__section__chart">
              <div className="widget-modal__section__chart__picker">
                <Picker
                  className="widget-modal__picker"
                  options={visualizationOptions}
                  {...form.propsByKey('widgetType')}
                />
              </div>
              <div className="widget-modal__section__chart__preview">
                <WidgetTimeseries widget={form.values} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WidgetModalBody;
