import {Organization} from 'sentry/types';

export function getPerformanceLandingUrl(organization: Organization): string {
  return `/organizations/${organization.slug}/performance/`;
}
