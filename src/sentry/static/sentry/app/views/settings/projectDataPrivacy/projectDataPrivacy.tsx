import React from 'react';

import Feature from 'sentry/components/acl/feature';
import FeatureDisabled from 'sentry/components/acl/featureDisabled';
import {PanelAlert} from 'sentry/components/panels';
import {t} from 'sentry/locale';

import ProjectDataPrivacyContent from './projectDataPrivacyContent';

type Props = ProjectDataPrivacyContent['props'];

const ProjectDataPrivacy = ({organization, ...props}: Props) => (
  <Feature
    features={['datascrubbers-v2']}
    organization={organization}
    renderDisabled={() => (
      <FeatureDisabled
        alert={PanelAlert}
        features={organization.features}
        featureName={t('Data Privacy - new')}
      />
    )}
  >
    <ProjectDataPrivacyContent {...props} organization={organization} />
  </Feature>
);

export default ProjectDataPrivacy;
