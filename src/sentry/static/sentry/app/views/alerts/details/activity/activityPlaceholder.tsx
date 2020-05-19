import React from 'react';
import styled from '@emotion/styled';

import ActivityItem from 'sentry/components/activity/item';
import space from 'sentry/styles/space';
import theme from 'sentry/utils/theme';

const ActivityPlaceholder = () => (
  <ActivityItem
    bubbleProps={{
      backgroundColor: theme.placeholderBackground,
      borderColor: theme.placeholderBackground,
    }}
  >
    {() => <Placeholder />}
  </ActivityItem>
);

const Placeholder = styled('div')`
  padding: ${space(4)};
`;

export default ActivityPlaceholder;
