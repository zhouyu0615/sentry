import styled from '@emotion/styled';

import InlineSvg from 'sentry/components/inlineSvg';

const HeroIcon = styled(InlineSvg)`
  color: ${p => p.theme.gray6};
`;

HeroIcon.defaultProps = {
  size: '72px',
};

export default HeroIcon;
