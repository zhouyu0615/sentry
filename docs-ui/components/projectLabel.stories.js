import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import ProjectLabel from 'sentry/components/projectLabel';

storiesOf('Deprecated|ProjectLabel', module).add(
  'default',
  withInfo('Do not use this, use IdBadge instead')(() => {
    return (
      <ProjectLabel
        project={{name: 'Project Name', slug: 'project-name'}}
        organization={{slug: 'test-org', features: []}}
      />
    );
  })
);
