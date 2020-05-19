import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import NarrowLayout from 'sentry/components/narrowLayout';

storiesOf('UI|NarrowLayout', module).add(
  'NarrowLayout',
  withInfo('A narrow layout')(() => <NarrowLayout>Narrow Layout</NarrowLayout>)
);
