import React from 'react';
import {Params} from 'react-router/lib/Router';
import {browserHistory} from 'react-router';
import {Location} from 'history';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';

import {Client} from 'sentry/api';
import {t} from 'sentry/locale';
import {fetchTotalCount} from 'sentry/actionCreators/events';
import {Organization, Project} from 'sentry/types';
import withOrganization from 'sentry/utils/withOrganization';
import withProjects from 'sentry/utils/withProjects';
import SentryDocumentTitle from 'sentry/components/sentryDocumentTitle';
import GlobalSelectionHeader from 'sentry/components/organizations/globalSelectionHeader';
import {PageContent} from 'sentry/styles/organization';
import EventView, {isAPIPayloadSimilar} from 'sentry/utils/discover/eventView';
import {decodeScalar} from 'sentry/utils/queryString';
import {stringifyQueryObject} from 'sentry/utils/tokenizeSearch';
import LightWeightNoProjectMessage from 'sentry/components/lightWeightNoProjectMessage';
import withApi from 'sentry/utils/withApi';

import SummaryContent from './content';

type Props = {
  api: Client;
  location: Location;
  params: Params;
  organization: Organization;
  projects: Project[];
  loadingProjects: boolean;
};

type State = {
  eventView: EventView | undefined;
  totalValues: number | null;
};

class TransactionSummary extends React.Component<Props, State> {
  state: State = {
    eventView: generateSummaryEventView(
      this.props.location,
      getTransactionName(this.props)
    ),
    totalValues: null,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
    return {
      ...prevState,
      eventView: generateSummaryEventView(
        nextProps.location,
        getTransactionName(nextProps)
      ),
    };
  }

  componentDidMount() {
    this.fetchTotalCount();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {location} = this.props;
    const {eventView} = this.state;

    if (eventView && prevState.eventView) {
      const currentQuery = eventView.getEventsAPIPayload(location);
      const prevQuery = prevState.eventView.getEventsAPIPayload(prevProps.location);
      if (!isAPIPayloadSimilar(currentQuery, prevQuery)) {
        this.fetchTotalCount();
      }
    }
  }

  async fetchTotalCount() {
    const {api, organization, location} = this.props;
    const {eventView} = this.state;
    if (!eventView || !eventView.isValid()) {
      return;
    }

    this.setState({totalValues: null});
    try {
      const totals = await fetchTotalCount(
        api,
        organization.slug,
        eventView.getEventsAPIPayload(location)
      );
      this.setState({totalValues: totals});
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  getDocumentTitle(): string {
    const name = getTransactionName(this.props);

    const hasTransactionName = typeof name === 'string' && String(name).trim().length > 0;

    if (hasTransactionName) {
      return [String(name).trim(), t('Performance')].join(' - ');
    }

    return [t('Summary'), t('Performance')].join(' - ');
  }

  render() {
    const {organization, location} = this.props;
    const {eventView, totalValues} = this.state;
    const transactionName = getTransactionName(this.props);
    if (!eventView || transactionName === undefined) {
      // If there is no transaction name, redirect to the Performance landing page

      browserHistory.replace({
        pathname: `/organizations/${organization.slug}/performance/`,
        query: {
          ...location.query,
        },
      });
      return null;
    }

    return (
      <SentryDocumentTitle title={this.getDocumentTitle()} objSlug={organization.slug}>
        <GlobalSelectionHeader>
          <StyledPageContent>
            <LightWeightNoProjectMessage organization={organization}>
              <SummaryContent
                location={location}
                organization={organization}
                eventView={eventView}
                transactionName={transactionName}
                totalValues={totalValues}
              />
            </LightWeightNoProjectMessage>
          </StyledPageContent>
        </GlobalSelectionHeader>
      </SentryDocumentTitle>
    );
  }
}

const StyledPageContent = styled(PageContent)`
  padding: 0;
`;

function getTransactionName(props: Props): string | undefined {
  const {location} = props;
  const {transaction} = location.query;

  return decodeScalar(transaction);
}

function generateSummaryEventView(
  location: Location,
  transactionName: string | undefined
): EventView | undefined {
  if (transactionName === undefined) {
    return undefined;
  }
  const conditions = {
    query: [],
    'event.type': ['transaction'],
    transaction: [transactionName],
  };
  // Handle duration filters from the latency chart
  if (location.query.startDuration || location.query.endDuration) {
    conditions['transaction.duration'] = [
      decodeScalar(location.query.startDuration),
      decodeScalar(location.query.endDuration),
    ]
      .filter(item => item)
      .map((item, index) => (index === 0 ? `>${item}` : `<${item}`));
  }

  return EventView.fromNewQueryWithLocation(
    {
      id: undefined,
      version: 2,
      name: transactionName,
      fields: ['id', 'user', 'transaction.duration', 'timestamp'],
      orderby: '-transaction.duration',
      query: stringifyQueryObject(conditions),
      projects: [],
    },
    location
  );
}

export default withApi(withProjects(withOrganization(TransactionSummary)));
