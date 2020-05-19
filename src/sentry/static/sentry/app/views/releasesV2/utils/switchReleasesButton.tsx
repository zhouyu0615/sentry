import React from 'react';

import {t} from 'sentry/locale';
import Button from 'sentry/components/button';

import {switchReleasesVersion} from './index';

type Props = {
  orgId: string; // actual id, not slug
  version: '1' | '2';
};

const SwitchReleasesButton = ({orgId, version}: Props) => {
  const switchReleases = () => {
    switchReleasesVersion(version, orgId);
  };

  return (
    <div>
      <Button priority="link" size="small" onClick={switchReleases}>
        {version === '1' && t('Go to Legacy Releases')}
        {version === '2' && t('Go to New Releases')}
      </Button>
    </div>
  );
};

export default SwitchReleasesButton;
