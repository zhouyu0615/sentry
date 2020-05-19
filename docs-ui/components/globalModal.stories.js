import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import GlobalModal from 'sentry/components/globalModal';
import Button from 'sentry/components/button';
import {openModal} from 'sentry/actionCreators/modal';

storiesOf('UI|Modals', module).add(
  'GlobalModal',
  withInfo('Call `openModal` action creator to open a modal', {
    propTablesExclude: ['Button'],
  })(() => (
    <div>
      <Button
        onClick={() =>
          openModal(({closeModal, Header, Body}) => (
            <div>
              <Header>Modal Header</Header>
              <Body>
                <div>Test Modal Body</div>
                <Button onClick={closeModal}>Close</Button>
              </Body>
            </div>
          ))
        }
      >
        Open
      </Button>
      <GlobalModal />
    </div>
  ))
);
