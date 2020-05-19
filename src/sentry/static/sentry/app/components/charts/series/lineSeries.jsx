import 'echarts/lib/chart/line';

import theme from 'sentry/utils/theme';

export default function LineSeries(props = {}) {
  return {
    showSymbol: false,
    symbolSize: theme.charts.symbolSize,
    ...props,
    type: 'line',
  };
}
