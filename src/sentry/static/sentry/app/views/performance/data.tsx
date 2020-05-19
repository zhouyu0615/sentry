import {Location} from 'history';

import {t} from 'sentry/locale';
import {NewQuery} from 'sentry/types';
import EventView from 'sentry/utils/discover/eventView';
import {decodeScalar} from 'sentry/utils/queryString';
import {stringifyQueryObject} from 'sentry/utils/tokenizeSearch';

export const DEFAULT_STATS_PERIOD = '24h';

export const PERFORMANCE_EVENT_VIEW: Readonly<NewQuery> = {
  id: undefined,
  name: t('Performance'),
  query: 'event.type:transaction',
  projects: [],
  fields: [
    'transaction',
    'project',
    'rpm()',
    'p50()',
    'p95()',
    'error_rate()',
    'apdex(300)',
    'count_unique(user)',
    'user_misery(300)',
  ],
  version: 2,
};
export const COLUMN_TITLES = [
  'transaction',
  'project',
  'throughput',
  'p50',
  'p95',
  'error rate',
  'apdex(300)',
  'users',
  'user misery',
];

export function generatePerformanceQuery(location: Location): Readonly<NewQuery> {
  const extra: {[key: string]: string} = {};

  const {query} = location;

  const hasStartAndEnd = query?.start && query?.end;

  if (!query?.statsPeriod && !hasStartAndEnd) {
    extra.range = DEFAULT_STATS_PERIOD;
  }

  if (!query?.sort) {
    extra.orderby = '-rpm';
  } else {
    const sort = query?.sort;
    extra.orderby =
      Array.isArray(sort) && sort.length > 0
        ? sort[sort.length - 1]
        : typeof sort === 'string'
        ? sort
        : '-rpm';
  }

  if (query?.query) {
    const searchQuery = decodeScalar(query.query);
    if (searchQuery) {
      extra.query = stringifyQueryObject({
        query: [PERFORMANCE_EVENT_VIEW.query],
        transaction: [`*${searchQuery}*`],
      });
    }
  }

  return Object.assign({}, PERFORMANCE_EVENT_VIEW, extra);
}

export function generatePerformanceEventView(location: Location): EventView {
  return EventView.fromNewQueryWithLocation(generatePerformanceQuery(location), location);
}
