import {RouteComponentProps} from 'react-router/lib/Router';
import React from 'react';

import {Activity, Organization} from 'sentry/types';
import {PageContent} from 'sentry/styles/organization';
import {Panel} from 'sentry/components/panels';
import {t} from 'sentry/locale';
import AsyncView from 'sentry/views/asyncView';
import EmptyMessage from 'sentry/views/settings/components/emptyMessage';
import ErrorBoundary from 'sentry/components/errorBoundary';
import LoadingIndicator from 'sentry/components/loadingIndicator';
import PageHeading from 'sentry/components/pageHeading';
import Pagination from 'sentry/components/pagination';
import routeTitle from 'sentry/utils/routeTitle';
import space from 'sentry/styles/space';
import withOrganization from 'sentry/utils/withOrganization';

import ActivityFeedItem from './activityFeedItem';

type Props = {
  organization: Organization;
} & RouteComponentProps<{orgId: string}, {}> &
  AsyncView['props'];

type State = {
  activity: Activity[];
} & AsyncView['state'];

class OrganizationActivity extends AsyncView<Props, State> {
  getTitle() {
    const {orgId} = this.props.params;
    return routeTitle(t('Activity'), orgId);
  }

  getEndpoints(): ReturnType<AsyncView['getEndpoints']> {
    return [['activity', `/organizations/${this.props.params.orgId}/activity/`]];
  }

  renderLoading() {
    return this.renderBody();
  }

  renderEmpty() {
    return (
      <EmptyMessage icon="icon-circle-exclamation">
        {t('Nothing to show here, move along.')}
      </EmptyMessage>
    );
  }

  renderBody() {
    const {loading, activity, activityPageLinks} = this.state;

    return (
      <PageContent>
        <PageHeading withMargins>{t('Activity')}</PageHeading>
        <Panel>
          {loading && <LoadingIndicator />}
          {!loading && !activity.length && this.renderEmpty()}
          {!loading && !!activity.length && (
            <div data-test-id="activity-feed-list">
              {activity.map(item => (
                <ErrorBoundary
                  mini
                  css={{marginBottom: space(1), borderRadius: 0}}
                  key={item.id}
                >
                  <ActivityFeedItem organization={this.props.organization} item={item} />
                </ErrorBoundary>
              ))}
            </div>
          )}
        </Panel>
        {activityPageLinks && (
          <Pagination pageLinks={activityPageLinks} {...this.props} />
        )}
      </PageContent>
    );
  }
}

export default withOrganization(OrganizationActivity);
