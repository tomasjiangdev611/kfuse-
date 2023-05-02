import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { selectionToCharts } from './chartUtils';

const propTypes = {
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  selection: PropTypes.shape({}).isRequired,
};

class SheetCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.updateChart = this.updateChart.bind(this);
    this.state = {
      charts: [],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { rows, selection } = this.props;
    if (rows !== nextProps.rows || selection !== nextProps.selection) {
      this.updateChart(nextProps.rows, nextProps.selection);
    }
  }

  updateChart(rows, selection) {
    const charts = selectionToCharts(rows, selection);

    this.setState({ charts });
  }

  render() {
    const { charts } = this.state;
    const { columns, height, width } = this.props;

    return (
      <div className="sheet-charts">
        {charts.map((chart) => (
          <div className="sheet-chart">
            <div className="sheet-chart__label">{columns[chart.key].name}</div>
            <div className="sheet-chart__main"></div>
          </div>
        ))}
      </div>
    );
  }
}

SheetCharts.propTypes = propTypes;

export default SheetCharts;
