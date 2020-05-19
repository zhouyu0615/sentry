import React from 'react';

import Feature from 'sentry/components/acl/feature';
import FeatureDisabled from 'sentry/components/acl/featureDisabled';
import {PanelAlert} from 'sentry/components/panels';
import {t} from 'sentry/locale';
import withOrganization from 'sentry/utils/withOrganization';

import OrganizationSecurityAndPrivacyContent from './organizationSecurityAndPrivacyContent';

const OrganizationSecurityAndPrivacy = ({
  organization,
  ...props
}: OrganizationSecurityAndPrivacyContent['props']) => (
  <Feature
    features={['datascrubbers-v2']}
    organization={organization}
    renderDisabled={() => (
      <FeatureDisabled
        alert={PanelAlert}
        features={organization.features}
        featureName={t('Security & Privacy - new')}
      />
    )}
  >
    <OrganizationSecurityAndPrivacyContent {...props} organization={organization} />
  </Feature>
);

export default withOrganization(OrganizationSecurityAndPrivacy);
