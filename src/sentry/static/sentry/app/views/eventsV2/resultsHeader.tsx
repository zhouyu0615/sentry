import React from 'react';
import {Location} from 'history';

import {Organization, SavedQuery} from 'sentry/types';
import {fetchSavedQuery} from 'sentry/actionCreators/discoverSavedQueries';
import {Client} from 'sentry/api';
import Feature from 'sentry/components/acl/feature';
import FeatureDisabled from 'sentry/components/acl/featureDisabled';
import Hovercard from 'sentry/components/hovercard';
import {t} from 'sentry/locale';
import withApi from 'sentry/utils/withApi';
import EventView from 'sentry/utils/discover/eventView';
import {HeaderBox, HeaderControls} from 'sentry/utils/discover/styles';

import DiscoverBreadcrumb from './breadcrumb';
import EventInputName from './eventInputName';
import SavedQueryButtonGroup from './savedQuery';

type Props = {
  api: Client;
  organization: Organization;
  location: Location;
  eventView: EventView;
};

type State = {
  savedQuery: SavedQuery | undefined;
  loading: boolean;
};

class ResultsHeader extends React.Component<Props, State> {
  state = {
    savedQuery: undefined,
    loading: true,
  };

  componentDidMount() {
    if (this.props.eventView.id) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.eventView &&
      this.props.eventView &&
      prevProps.eventView.id !== this.props.eventView.id
    ) {
      this.fetchData();
    }
  }

  fetchData() {
    const {api, eventView, organization} = this.props;
    if (typeof eventView.id === 'string') {
      this.setState({loading: true});
      fetchSavedQuery(api, organization.slug, eventView.id).then(savedQuery => {
        this.setState({savedQuery, loading: false});
      });
    }
  }

  render() {
    const {organization, location, eventView} = this.props;
    const {savedQuery, loading} = this.state;

    const renderDisabled = p => (
      <Hovercard
        body={
          <FeatureDisabled
            features={p.features}
            hideHelpToggle
            message={t('Discover queries are disabled')}
            featureName={t('Discover queries')}
          />
        }
      >
        {p.children(p)}
      </Hovercard>
    );

    return (
      <HeaderBox>
        <DiscoverBreadcrumb
          eventView={eventView}
          organization={organization}
          location={location}
        />
        <EventInputName
          savedQuery={savedQuery}
          organization={organization}
          eventView={eventView}
        />
        <HeaderControls>
          <Feature
            organization={organization}
            features={['discover-query']}
            hookName="feature-disabled:discover-saved-query-create"
            renderDisabled={renderDisabled}
          >
            {({hasFeature}) => (
              <SavedQueryButtonGroup
                location={location}
                organization={organization}
                eventView={eventView}
                savedQuery={savedQuery}
                savedQueryLoading={loading}
                disabled={!hasFeature}
              />
            )}
          </Feature>
        </HeaderControls>
      </HeaderBox>
    );
  }
}

export default withApi(ResultsHeader);
