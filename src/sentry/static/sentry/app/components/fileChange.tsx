import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

import {ListGroupItem} from 'sentry/components/listGroup';
import space from 'sentry/styles/space';
import overflowEllipsis from 'sentry/styles/overflowEllipsis';
import {AvatarUser} from 'sentry/types';
import AvatarList from 'sentry/components/avatar/avatarList';
import {IconFile} from 'sentry/icons';

type Props = {
  filename: string;
  authors: AvatarUser[];
};

const FileChange = ({filename, authors}: Props) => (
  <FileItem>
    <Filename>
      <StyledIconFile size="xs" />
      {filename}
    </Filename>
    <div>
      <AvatarList users={authors} avatarSize={25} typeMembers="authors" />
    </div>
  </FileItem>
);

FileChange.propTypes = {
  filename: PropTypes.string.isRequired,
  authors: PropTypes.array.isRequired,
};

const FileItem = styled(ListGroupItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Filename = styled('div')`
  font-size: ${p => p.theme.fontSizeMedium};
  ${overflowEllipsis}
`;

const StyledIconFile = styled(IconFile)`
  color: ${p => p.theme.gray1};
  margin-right: ${space(1)};
`;

export default FileChange;
