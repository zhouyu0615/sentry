import React from 'react';

import {t} from 'sentry/locale';
import Alert from 'sentry/components/alert';

const ComingSoon = () => (
  <Alert type="info" icon="icon-circle-info">
    {t('This feature is coming soon!')}
  </Alert>
);

export default ComingSoon;
