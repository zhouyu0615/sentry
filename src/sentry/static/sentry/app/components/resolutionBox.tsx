import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

import UserAvatar from 'sentry/components/avatar/userAvatar';
import {BannerContainer, BannerSummary} from 'sentry/components/events/styles';
import CommitLink from 'sentry/components/commitLink';
import TimeSince from 'sentry/components/timeSince';
import Version from 'sentry/components/version';
import {IconCheckmark} from 'sentry/icons';
import {t, tct} from 'sentry/locale';
import space from 'sentry/styles/space';
import {ResolutionStatusDetails} from 'sentry/types';

type Props = {
  statusDetails: ResolutionStatusDetails;
  projectId: string;
};

function renderReason(statusDetails: ResolutionStatusDetails, projectId: string) {
  const actor = statusDetails.actor ? (
    <strong>
      <UserAvatar user={statusDetails.actor} size={20} className="avatar" />
      <span style={{marginLeft: 5}}>{statusDetails.actor.name}</span>
    </strong>
  ) : null;

  if (statusDetails.inNextRelease && statusDetails.actor) {
    return tct('[actor] marked this issue as resolved in the upcoming release.', {
      actor,
    });
  } else if (statusDetails.inNextRelease) {
    return t('This issue has been marked as resolved in the upcoming release.');
  } else if (statusDetails.inRelease && statusDetails.actor) {
    return tct('[actor] marked this issue as resolved in version [version].', {
      actor,
      version: (
        <Version
          version={statusDetails.inRelease}
          projectId={projectId}
          tooltipRawVersion
        />
      ),
    });
  } else if (statusDetails.inRelease) {
    return tct('This issue has been marked as resolved in version [version].', {
      version: (
        <Version
          version={statusDetails.inRelease}
          projectId={projectId}
          tooltipRawVersion
        />
      ),
    });
  } else if (!!statusDetails.inCommit) {
    return tct('This issue has been marked as resolved by [commit]', {
      commit: (
        <React.Fragment>
          <CommitLink
            commitId={statusDetails.inCommit.id}
            repository={statusDetails.inCommit.repository}
          />
          <StyledTimeSince date={statusDetails.inCommit.dateCreated} />
        </React.Fragment>
      ),
    });
  }
  return t('This issue has been marked as resolved.');
}

function ResolutionBox({statusDetails, projectId}: Props) {
  return (
    <BannerContainer priority="default">
      <BannerSummary>
        <IconCheckmark color="green" />
        <span>{renderReason(statusDetails, projectId)}</span>
      </BannerSummary>
    </BannerContainer>
  );
}

ResolutionBox.propTypes = {
  statusDetails: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
};

const StyledTimeSince = styled(TimeSince)`
  color: ${p => p.theme.gray2};
  margin-left: ${space(0.5)};
  font-size: ${p => p.theme.fontSizeSmall};
`;

export default ResolutionBox;
