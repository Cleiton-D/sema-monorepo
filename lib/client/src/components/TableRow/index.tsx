import React, {
  memo,
  Children,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';

import { TableColumnProps } from 'components/TableColumn';
import TableCell from 'components/TableCell';

import { WithAccessOptions } from 'utils/validateHasAccess';

import * as S from './styles';

type RenderChildrenFunction = (item: any) => React.ReactNode;

type TableRowProps = {
  item: Record<string, any>;
  columns:
    | React.ReactElement<TableColumnProps & Partial<WithAccessOptions>>
    | React.ReactElement<TableColumnProps & Partial<WithAccessOptions>>[];
  rowKey: string;
};

const TableRow = ({ item, columns, rowKey }: TableRowProps): JSX.Element => {
  const [internalContent, setInternalContent] = useState<
    RenderChildrenFunction | React.ReactNode | null
  >();

  const childArray = useMemo(
    () => Children.map(columns, ({ props }) => props),
    [columns]
  );

  const handleOpen = useCallback(
    (renderContent: RenderChildrenFunction | React.ReactNode | null) => {
      const content =
        typeof renderContent === 'function'
          ? renderContent(item)
          : renderContent;

      setInternalContent(content);
    },
    [item]
  );

  useEffect(() => {
    const opened = childArray.find(({ open, children }) => open && !!children);
    if (opened) {
      handleOpen(opened.children);
    }
  }, [childArray, item, handleOpen]);

  return (
    <>
      <S.Wrapper key={rowKey} disabledItem={item.disabled}>
        {childArray.map((columnProps) => (
          <TableCell
            key={`${rowKey}_${columnProps.tableKey}_${columnProps.label}`}
            columnProps={columnProps}
            item={item}
            objectKey={columnProps.tableKey}
            renderInternalContent={handleOpen}
            module={columnProps.module}
            rule={columnProps.rule}
          />
        ))}
      </S.Wrapper>

      <S.DetailLine active={!!internalContent}>
        <td colSpan={Children.count(columns)}>
          <div>{internalContent}</div>
        </td>
      </S.DetailLine>
    </>
  );
};

export default memo(TableRow);
