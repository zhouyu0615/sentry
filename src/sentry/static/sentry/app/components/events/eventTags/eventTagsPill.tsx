import React from 'react';
import {Link} from 'react-router';
import queryString from 'query-string';
import {Query} from 'history';

import {EventTag, Meta} from 'sentry/types';
import AnnotatedText from 'sentry/components/events/meta/annotatedText';
import DeviceName from 'sentry/components/deviceName';
import {isUrl} from 'sentry/utils';
import Pill from 'sentry/components/pill';
import VersionHoverCard from 'sentry/components/versionHoverCard';
import InlineSvg from 'sentry/components/inlineSvg';
import Version from 'sentry/components/version';
import {IconOpen} from 'sentry/icons';

type Props = {
  tag: EventTag;
  streamPath: string;
  releasesPath: string;
  query: Query;
  orgId: string;
  projectId: string;
  meta: Meta;
};

const EventTagsPill = ({
  tag,
  query,
  orgId,
  projectId,
  streamPath,
  releasesPath,
  meta,
}: Props) => {
  const locationSearch = `?${queryString.stringify(query)}`;
  const isRelease = tag.key === 'release';
  return (
    <Pill key={tag.key} name={tag.key} value={tag.value}>
      <Link
        to={{
          pathname: streamPath,
          search: locationSearch,
        }}
      >
        {isRelease ? (
          <Version version={tag.value} anchor={false} tooltipRawVersion truncate />
        ) : (
          <DeviceName value={tag.value}>
            {deviceName => <AnnotatedText value={deviceName} meta={meta} />}
          </DeviceName>
        )}
      </Link>
      {isUrl(tag.value) && (
        <a href={tag.value} className="external-icon">
          <IconOpen size="xs" />
        </a>
      )}
      {isRelease && (
        <VersionHoverCard
          containerClassName="pill-icon"
          version={tag.value}
          orgId={orgId}
          projectId={projectId}
        >
          <Link
            to={{
              pathname: `${releasesPath}${tag.value}/`,
              search: locationSearch,
            }}
          >
            <InlineSvg src="icon-circle-info" size="14px" />
          </Link>
        </VersionHoverCard>
      )}
    </Pill>
  );
};

export default EventTagsPill;
