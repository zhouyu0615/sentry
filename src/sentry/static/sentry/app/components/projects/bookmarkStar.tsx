import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

import {addErrorMessage} from 'sentry/actionCreators/indicator';
import {defined} from 'sentry/utils';
import InlineSvg from 'sentry/components/inlineSvg';
import SentryTypes from 'sentry/sentryTypes';
import {t} from 'sentry/locale';
import {update} from 'sentry/actionCreators/projects';
import withApi from 'sentry/utils/withApi';
import {Organization, Project} from 'sentry/types';
import {Client} from 'sentry/api';

type Props = {
  api: Client;
  /* used to override when under local state */
  isBookmarked?: boolean;
  className?: string;
  organization: Organization;
  project: Project;
  onToggle?: (isBookmarked: boolean) => void;
};

const BookmarkStar = ({
  api,
  isBookmarked: isBookmarkedProp,
  className,
  organization,
  project,
  onToggle,
}: Props) => {
  const isBookmarked = defined(isBookmarkedProp)
    ? isBookmarkedProp
    : project.isBookmarked;

  const toggleProjectBookmark = (event: React.MouseEvent) => {
    update(api, {
      orgId: organization.slug,
      projectId: project.slug,
      data: {isBookmarked: !isBookmarked},
    }).catch(() => {
      addErrorMessage(t('Unable to toggle bookmark for %s', project.slug));
    });

    //needed to dismiss tooltip
    (document.activeElement as HTMLElement).blur();

    //prevent dropdowns from closing
    event.stopPropagation();

    if (onToggle) {
      onToggle(!isBookmarked);
    }
  };

  return (
    <Star
      isBookmarked={isBookmarked}
      src="icon-star-small-filled"
      onClick={toggleProjectBookmark}
      className={className}
    />
  );
};

BookmarkStar.propTypes = {
  api: PropTypes.any.isRequired,
  /* used to override when under local state */
  isBookmarked: PropTypes.bool,
  className: PropTypes.string,
  organization: SentryTypes.Organization.isRequired,
  project: SentryTypes.Project.isRequired,
  onToggle: PropTypes.func,
};

const Star = styled(InlineSvg)<{isBookmarked: boolean}>`
  color: ${p => (p.isBookmarked ? p.theme.yellowOrange : p.theme.gray1)};

  &:hover {
    color: ${p => (p.isBookmarked ? p.theme.yellowOrangeLight : p.theme.gray2)};
  }
`;

export default withApi(BookmarkStar);
