import * as d3 from 'd3';
import { flamegraph } from 'd3-flame-graph';
import { useLayoutEffect } from 'react';

const D3FlameGraph = ({ data, element, width, height }) => {
  useLayoutEffect(() => {
    var chart = flamegraph()
      .width(width)
      .cellHeight(18)
      .computeDelta(true)
      .inverted(true)
      .selfValue(true)
      .transitionDuration(750)
      .transitionEase(d3.easeCubic)
      .sort(true)
      //Example to sort in reverse order
      //.sort(function(a,b){ return d3.descending(a.data.name, b.data.name);})
      .title('');

    // Example on how to use custom tooltips using d3-tip.
    // var tooltip = d3tip()
    //   .direction('s')
    //   .offset([8, 0])
    //   .attr('class', 'd3-flame-graph-tip')
    //   .html(function (d) {
    //     return 'name: ' + d.data.name + ', value: ' + d.data.value;
    //   });
    //
    // chart.tooltip(tooltip);

    var label = function(d) {
     return "name: " + d.data.name + ", value: " + d.data.value;
    }

    chart.label(label);
    const svg = d3.select(element).append('svg');
    svg.datum(data).call(chart);

    return () => {
      svg.remove();
    };
  }, [data, element, width, height]);

  return null;
};

export default D3FlameGraph;
