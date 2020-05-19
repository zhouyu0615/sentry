import {getChartDataForWidget, getChartDataByDay} from 'sentry/views/discover/result/utils';

import {isTimeSeries} from './isTimeSeries';
import {WIDGET_DISPLAY} from '../constants';

/**
 * Get data function based on widget properties
 */
export function getChartDataFunc({queries, type, fieldLabelMap}) {
  if (queries.discover.some(isTimeSeries)) {
    return [
      getChartDataByDay,
      [
        {
          allSeries: true,
          fieldLabelMap,
        },
      ],
    ];
  }

  return [
    getChartDataForWidget,
    [
      {
        includePercentages: type === WIDGET_DISPLAY.TABLE,
      },
    ],
  ];
}
