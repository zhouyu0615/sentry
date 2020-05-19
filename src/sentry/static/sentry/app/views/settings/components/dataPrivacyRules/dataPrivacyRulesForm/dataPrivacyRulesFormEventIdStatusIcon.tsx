import React from 'react';
import styled from '@emotion/styled';

import ControlState from 'sentry/views/settings/components/forms/field/controlState';
import {t} from 'sentry/locale';
import Tooltip from 'sentry/components/tooltip';
import {IconClose, IconCheckmark} from 'sentry/icons';

import {EventIdStatus} from './types';

type Props = {
  onClickIconClose: () => void;
  status?: EventIdStatus;
};

const DataPrivacyRulesFormEventIdStatusIcon = ({status, onClickIconClose}: Props) => {
  switch (status) {
    case EventIdStatus.ERROR:
    case EventIdStatus.INVALID:
    case EventIdStatus.NOT_FOUND:
      return (
        <CloseIcon onClick={onClickIconClose}>
          <Tooltip title={t('Clear Event ID')}>
            <IconClose color="red" />
          </Tooltip>
        </CloseIcon>
      );
    case EventIdStatus.LOADING:
      return <ControlState isSaving />;
    case EventIdStatus.LOADED:
      return <IconCheckmark color="green" />;
    default:
      return null;
  }
};

export default DataPrivacyRulesFormEventIdStatusIcon;

const CloseIcon = styled('div')`
  cursor: pointer;
  :first-child {
    line-height: 0;
  }
`;
