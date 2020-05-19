import LineSeries from 'sentry/components/charts/series/lineSeries';

export default function AreaSeries(props = {}) {
  return LineSeries({
    ...props,
  });
}
