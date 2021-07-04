import { useEffect, useRef, useCallback, useState, memo } from 'react';

import { useTable } from 'components/Table';

import { getElementPositionFromParent } from 'utils/getElementPositionFromParent';

import * as S from './styles';
import { withAccessComponent } from 'hooks/AccessProvider';

type RenderChildrenFunction = (item: any) => React.ReactNode;

export type TableColumnProps = {
  tableKey: string;
  label: string;
  fixed?: boolean;
  contentAlign?: 'left' | 'center' | 'right';
  actionColumn?: boolean;
  render?: (value: any) => React.ReactNode;
  children?: React.ReactNode | RenderChildrenFunction;
  open?: boolean;
  ellipsis?: boolean;
};

const TableColumn = ({
  label,
  tableKey,
  fixed = false,
  contentAlign = 'left'
}: TableColumnProps) => {
  const [position, setPosition] = useState(0);
  const localRef = useRef<HTMLTableHeaderCellElement>(null);

  const { eventEmitter, minimal } = useTable();

  const recalculatePosition = useCallback(() => {
    if (localRef.current && fixed) {
      setPosition(0);

      const newPosition = getElementPositionFromParent(localRef.current);
      setPosition(newPosition);
    }
  }, [fixed]);

  useEffect(() => {
    recalculatePosition();
  }, [recalculatePosition]);

  useEffect(() => {
    if (!fixed) return;
    eventEmitter.on('resize', recalculatePosition);

    return () => {
      eventEmitter.off('resize', recalculatePosition);
    };
  }, [eventEmitter, recalculatePosition, fixed]);

  useEffect(() => {
    if (!fixed) return;

    const key = `${label}_${tableKey}`;
    eventEmitter.emit(`change_position_${key}`, position);
  }, [position, eventEmitter, label, tableKey, fixed]);

  return (
    <S.Wrapper
      ref={localRef}
      fixed={fixed}
      position={position}
      minimal={minimal}
      contentAlign={contentAlign}
    >
      {label}
    </S.Wrapper>
  );
};

export default withAccessComponent(memo(TableColumn));
