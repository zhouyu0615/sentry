import React from 'react';

import {t} from 'sentry/locale';
import Button from 'sentry/components/button';
import {IconDelete} from 'sentry/icons';

type Props = Omit<React.ComponentProps<typeof Button>, 'onClick'> & {
  index: number;
  onClick: (index: number, e: React.MouseEvent) => void;
};

export default function DeleteActionButton(props: Props) {
  const handleClick = (e: React.MouseEvent) => {
    const {index, onClick} = props;
    onClick(index, e);
  };

  return (
    <Button
      type="button"
      size="small"
      icon={<IconDelete size="xs" />}
      aria-label={t('Remove action')}
      {...props}
      onClick={handleClick}
    />
  );
}
