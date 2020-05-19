import React from 'react';
import styled from '@emotion/styled';

import Button from 'sentry/components/button';
import {growIn} from 'sentry/styles/animations';
import space from 'sentry/styles/space';
import {t} from 'sentry/locale';

type Props = {
  onSubmit: () => void;
};

const BreadcrumbFilterFooter = ({onSubmit}: Props) => (
  <Wrapper>
    <ApplyFilterButton onClick={onSubmit} size="xsmall" priority="primary">
      {t('Apply Filter')}
    </ApplyFilterButton>
  </Wrapper>
);

const Wrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
  background-color: ${p => p.theme.offWhite};
  padding: ${space(1)};
`;

const ApplyFilterButton = styled(Button)`
  animation: 0.1s ${growIn} ease-in;
  margin: ${space(0.5)} 0;
`;

export default BreadcrumbFilterFooter;
