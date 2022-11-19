import {
  useMemo,
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
  memo,
  Children,
  isValidElement,
  ReactNode
} from 'react';
import mitt, { Emitter } from 'mitt';
import debounce from 'lodash.debounce';

import { TableColumnProps } from 'components/TableColumn';
import TableRow, { TableRowProps } from 'components/TableRow';

import { WithAccessOptions } from 'utils/validateHasAccess';

import * as S from './styles';

type CommonTableColumn = React.ReactElement<
  TableColumnProps & Partial<WithAccessOptions>
>;

type ConditionalItem = false | Element | boolean;

type TableChildren = CommonTableColumn | ConditionalItem | JSX.Element[];

export type TableProps<T> = {
  minimal?: boolean;
  items: T[];
  keyExtractor: (value: T) => string;
  children: TableChildren | TableChildren[];
  columnDivider?: boolean;
  renderRow?: (props: TableRowProps<T>) => JSX.Element;
};

type TableContextProps = {
  eventEmitter: Emitter;
  minimal: boolean;
};
const TableContext = createContext<TableContextProps>({} as TableContextProps);

function Table<T extends Record<string, any>>({
  minimal = false,
  items,
  keyExtractor,
  children,
  columnDivider = false,
  renderRow
}: TableProps<T>): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const eventEmitter = useMemo(mitt, []);

  const resizeHandler = useCallback(() => {
    eventEmitter.emit('resize');
  }, [eventEmitter]);

  const newItems = useMemo(
    () =>
      items.map((item) => ({
        key: keyExtractor(item),
        value: item
      })),
    [items, keyExtractor]
  );

  const newChildrens = useMemo(() => {
    const childArray = Children.toArray(children as ReactNode);
    const newChilds = childArray.filter(isValidElement);
    return newChilds as CommonTableColumn | CommonTableColumn[];
  }, [children]);

  useEffect(() => {
    const target = containerRef.current;

    const debounced = debounce(resizeHandler, 150);
    const resizeObserver = new ResizeObserver(debounced);
    if (target) {
      resizeObserver.observe(target);
    }

    return () => {
      if (target) {
        resizeObserver.unobserve(target);
      }
    };
  }, [resizeHandler]);

  return (
    <TableContext.Provider value={{ eventEmitter, minimal }}>
      <S.Wrapper ref={containerRef} columnDivider={columnDivider}>
        <table>
          <S.TableHeader>
            <tr>{children as ReactNode}</tr>
          </S.TableHeader>
          <tbody>
            {newItems.map((item, index) => {
              const rowProps: TableRowProps<T> = {
                item: item.value,
                columns: newChildrens,
                rowKey: item.key,
                lineIndex: index
              };

              if (renderRow) {
                return renderRow(rowProps);
              }

              return <TableRow key={item.key} {...rowProps} />;
            })}
          </tbody>
        </table>
      </S.Wrapper>
    </TableContext.Provider>
  );
}

export const useTable = () => useContext(TableContext);

export default memo(Table) as typeof Table;
