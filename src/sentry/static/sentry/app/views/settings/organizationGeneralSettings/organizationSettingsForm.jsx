import PropTypes from 'prop-types';
import React from 'react';

import {addErrorMessage} from 'sentry/actionCreators/indicator';
import {updateOrganization} from 'sentry/actionCreators/organizations';
import AsyncComponent from 'sentry/components/asyncComponent';
import AvatarChooser from 'sentry/components/avatarChooser';
import Form from 'sentry/views/settings/components/forms/form';
import JsonForm from 'sentry/views/settings/components/forms/jsonForm';
import SentryTypes from 'sentry/sentryTypes';
import organizationSettingsFields from 'sentry/data/forms/organizationGeneralSettings';
import withOrganization from 'sentry/utils/withOrganization';
import Link from 'sentry/components/links/link';
import EmptyMessage from 'sentry/views/settings/components/emptyMessage';
import organizationSecurityAndPrivacy from 'sentry/data/forms/organizationSecurityAndPrivacy';
import Feature from 'sentry/components/acl/feature';
import {t} from 'sentry/locale';
import {Panel, PanelHeader} from 'sentry/components/panels';

class OrganizationSettingsForm extends AsyncComponent {
  static propTypes = {
    location: PropTypes.object,
    organization: SentryTypes.Organization,
    orgId: PropTypes.string.isRequired,
    access: PropTypes.object.isRequired,
    initialData: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  getEndpoints() {
    const {orgId} = this.props;
    return [['authProvider', `/organizations/${orgId}/auth-provider/`]];
  }

  render() {
    const {initialData, organization, orgId, onSave, access} = this.props;
    const {authProvider} = this.state;
    const endpoint = `/organizations/${orgId}/`;

    const jsonFormSettings = {
      additionalFieldProps: {hasSsoEnabled: !!authProvider},
      features: new Set(organization.features),
      access,
      location: this.props.location,
      disabled: !access.has('org:write'),
    };

    return (
      <Form
        data-test-id="organization-settings"
        apiMethod="PUT"
        apiEndpoint={endpoint}
        saveOnBlur
        allowUndo
        initialData={initialData}
        onSubmitSuccess={(_resp, model) => {
          // Special case for slug, need to forward to new slug
          if (typeof onSave === 'function') {
            onSave(initialData, model.initialData);
          }
        }}
        onSubmitError={() => addErrorMessage('Unable to save change')}
      >
        <JsonForm {...jsonFormSettings} forms={organizationSettingsFields} />

        <Feature features={['datascrubbers-v2']}>
          {({hasFeature}) =>
            hasFeature ? (
              <Panel>
                <PanelHeader>{t('Security & Privacy')}</PanelHeader>
                <EmptyMessage
                  title={t('Security & Privacy section now has its own tab')}
                  description={
                    <Link to={`/settings/${orgId}/security-and-privacy/`}>
                      {t('Go to Security & Privacy')}
                    </Link>
                  }
                />
              </Panel>
            ) : (
              <JsonForm {...jsonFormSettings} forms={organizationSecurityAndPrivacy} />
            )
          }
        </Feature>

        <AvatarChooser
          type="organization"
          allowGravatar={false}
          endpoint={`${endpoint}avatar/`}
          model={initialData}
          onSave={updateOrganization}
          disabled={!access.has('org:write')}
        />
      </Form>
    );
  }
}

export default withOrganization(OrganizationSettingsForm);
