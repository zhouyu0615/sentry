import React from 'react';
import {RouteComponentProps} from 'react-router/lib/Router';

import {t} from 'sentry/locale';
import ReleaseArtifactsV1 from 'sentry/views/releases/detail/releaseArtifacts';
import AsyncView from 'sentry/views/asyncView';
import routeTitleGen from 'sentry/utils/routeTitle';
import {formatVersion} from 'sentry/utils/formatters';
import withOrganization from 'sentry/utils/withOrganization';
import {Organization} from 'sentry/types';

import {ReleaseContext} from '..';

type RouteParams = {
  orgId: string;
  release: string;
};

type Props = RouteComponentProps<RouteParams, {}> & {
  organization: Organization;
};

class ReleaseArtifacts extends AsyncView<Props> {
  static contextType = ReleaseContext;

  getTitle() {
    const {params, organization} = this.props;
    return routeTitleGen(
      t('Artifacts - Release %s', formatVersion(params.release)),
      organization.slug,
      false
    );
  }

  renderBody() {
    const {project} = this.context;
    const {params, location} = this.props;

    return (
      <ReleaseArtifactsV1
        params={params}
        location={location}
        projectId={project.slug}
        smallEmptyMessage
      />
    );
  }
}

export default withOrganization(ReleaseArtifacts);
