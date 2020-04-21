import {Params} from 'react-router/lib/Router';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {Location} from 'history';

import {EventQuery} from 'app/actionCreators/events';
import {Organization, Event, Project} from 'app/types';
import {PageContent} from 'app/styles/organization';
import {t} from 'app/locale';
import GlobalSelectionHeader from 'app/components/organizations/globalSelectionHeader';
import LightWeightNoProjectMessage from 'app/components/lightWeightNoProjectMessage';
import SentryDocumentTitle from 'app/components/sentryDocumentTitle';
import SentryTypes from 'app/sentryTypes';
import withOrganization from 'app/utils/withOrganization';
import EventView from 'app/utils/discover/eventView';
import AsyncComponent from 'app/components/asyncComponent';
import NotFound from 'app/components/errors/notFound';
import LoadingError from 'app/components/loadingError';
import withProjects from 'app/utils/withProjects';

import EventDetailsContent from './content';

type Props = {
  organization: Organization;
  location: Location;
  params: Params;

  // props from withProjects
  projects: Project[];
  loadingProjects: boolean;
};

type State = {
  event: Event | undefined;
} & AsyncComponent['state'];

class EventDetails extends AsyncComponent<Props, State> {
  static propTypes: any = {
    organization: SentryTypes.Organization.isRequired,
    location: PropTypes.object.isRequired,
  };

  state: State = {
    // AsyncComponent state
    loading: true,
    reloading: false,
    error: false,
    errors: [],
    event: undefined,
  };

  getEndpoints = (): Array<[string, string, {query: EventQuery}]> => {
    const {organization, params, location} = this.props;
    const {eventSlug} = params;
    const eventView = this.getEventView();

    const query = eventView.getEventsAPIPayload(location);

    const url = `/organizations/${organization.slug}/events/${eventSlug}/`;

    // Get a specific event. This could be coming from
    // a paginated group or standalone event.
    return [['event', url, {query}]];
  };

  renderBody() {
    const {event} = this.state;

    if (!event) {
      return this.renderWrapper(<NotFound />);
    }

    return this.renderWrapper(this.renderContent(event));
  }

  renderWrapper(children: React.ReactNode) {
    const {organization, projects} = this.props;
    const {event} = this.state;
    const eventView = this.getEventView();

    const documentTitle = this.getDocumentTitle(eventView.name).join(' - ');

    const forceProject = Array.isArray(projects)
      ? projects.find(project => {
          return project.id === event?.projectID;
        })
      : undefined;

    return (
      <SentryDocumentTitle title={documentTitle} objSlug={organization.slug}>
        <React.Fragment>
          <GlobalSelectionHeader
            organization={organization}
            lockedMessageSubject={t('event')}
            shouldForceProject
            forceProject={forceProject}
            showDateSelector={false}
            showProjectSettingsLink
          />
          <StyledPageContent>
            <LightWeightNoProjectMessage organization={organization}>
              {children}
            </LightWeightNoProjectMessage>
          </StyledPageContent>
        </React.Fragment>
      </SentryDocumentTitle>
    );
  }

  renderContent(event: Event) {
    const {organization, location, params} = this.props;
    const eventView = this.getEventView();

    return (
      <EventDetailsContent
        organization={organization}
        location={location}
        params={params}
        eventView={eventView}
        eventSlug={this.getEventSlug()}
        event={event}
      />
    );
  }

  renderError(error) {
    const notFound = Object.values(this.state.errors).find(
      resp => resp && resp.status === 404
    );
    const permissionDenied = Object.values(this.state.errors).find(
      resp => resp && resp.status === 403
    );

    if (notFound) {
      return this.renderWrapper(<NotFound />);
    }
    if (permissionDenied) {
      return this.renderWrapper(
        <LoadingError message={t('You do not have permission to view that event.')} />
      );
    }

    return this.renderWrapper(super.renderError(error, true, true));
  }

  renderLoading() {
    return this.renderWrapper(super.renderLoading());
  }

  getEventSlug = (): string => {
    const {eventSlug} = this.props.params;

    if (typeof eventSlug === 'string') {
      return eventSlug.trim();
    }

    return '';
  };

  getEventView = (): EventView => {
    const {location} = this.props;

    return EventView.fromLocation(location);
  };

  getDocumentTitle = (name: string | undefined): Array<string> =>
    typeof name === 'string' && String(name).trim().length > 0
      ? [String(name).trim(), t('Discover')]
      : [t('Discover')];
}

export default withOrganization(withProjects(EventDetails));

const StyledPageContent = styled(PageContent)`
  padding: 0;
`;
