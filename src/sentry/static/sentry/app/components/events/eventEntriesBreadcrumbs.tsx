import React from 'react';

import Feature from 'sentry/components/acl/feature';
import BreadcrumbsInterface from 'sentry/components/events/interfaces/breadcrumbs/breadcrumbs';
import BreadcrumbsInterfaceV2 from 'sentry/components/events/interfaces/breadcrumbsV2/breadcrumbs';

type Props = React.ComponentProps<typeof BreadcrumbsInterfaceV2>;
type BreadcrumbsInterfaceProps = React.ComponentProps<typeof BreadcrumbsInterface>;

const EventEntriesBreadcrumbs = (props: Props) => (
  <Feature features={['breadcrumbs-v2']}>
    {({hasFeature}) =>
      hasFeature ? (
        <BreadcrumbsInterfaceV2 {...props} />
      ) : (
        <BreadcrumbsInterface {...(props as BreadcrumbsInterfaceProps)} />
      )
    }
  </Feature>
);

export default EventEntriesBreadcrumbs;
