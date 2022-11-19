import { useMemo } from 'react';

import UnregisteredSelect from 'components/UnregisteredSelect';

import * as S from './styles';

type Paginator = {
  total: number;
  currentSize: number;
  currentPage: number;
  onChangePage?: (page: number) => void;
  onChangeSize?: (page: number) => void;
};

const getNextPages = (page: number, total: number, length: number) => {
  const nextPages: number[] = [];

  Array.from({ length }).reduce<number>((prev) => {
    const item = prev + 1;
    if (item > total) return prev;

    nextPages.push(item);
    return item;
  }, page);

  return nextPages;
};

const getPrevPages = (page: number, length: number) => {
  const prevPages: number[] = [];

  Array.from({ length }).reduce<number>((prev) => {
    const item = prev - 1;
    if (item <= 0) return prev;

    prevPages.push(item);
    return item;
  }, page);

  return prevPages;
};

const PAGINATOR_OPTIONS = [
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
];

const Paginator = ({
  total,
  currentSize,
  currentPage,
  onChangePage,
  onChangeSize
}: Paginator): JSX.Element => {
  const handleChangeSize = (size: number) => {
    onChangeSize?.(size);
    onChangePage?.(1);
  };

  const pagesLength = useMemo(() => {
    return Math.ceil(total / currentSize);
  }, [total, currentSize]);

  const pageRange = useMemo(() => {
    const result = [currentPage];

    if (currentPage === 1) {
      const nextPages = getNextPages(currentPage, pagesLength, 2);
      result.push(...nextPages);
    } else if (currentPage === pagesLength) {
      const prevPages = getPrevPages(currentPage, 2);
      result.push(...prevPages);
    } else {
      const nextPages = getNextPages(currentPage, pagesLength, 1);
      const prevPages = getPrevPages(currentPage, 1);
      result.push(...nextPages, ...prevPages);
    }

    return result.sort((a, b) => a - b);
  }, [currentPage, pagesLength]);

  return (
    <S.Wrapper>
      <S.PageItemsContainer>
        <S.PageItem
          isActive={false}
          onClick={() => onChangePage?.(1)}
          disabled={currentPage === 1}
        >
          Primeira
        </S.PageItem>

        {pageRange.map((item) => (
          <S.PageItem
            key={item}
            type="button"
            isActive={currentPage === item}
            onClick={() => onChangePage?.(item)}
          >
            {item}
          </S.PageItem>
        ))}

        <S.PageItem
          isActive={false}
          onClick={() => onChangePage?.(pagesLength)}
          disabled={currentPage >= pagesLength}
        >
          Última
        </S.PageItem>
      </S.PageItemsContainer>

      <S.SizeContainer>
        <S.SizeText>Mostrando</S.SizeText>

        <UnregisteredSelect
          label=""
          name=""
          options={PAGINATOR_OPTIONS}
          selectedOption={currentSize}
          size="medium"
          onChange={handleChangeSize}
        />

        <S.SizeText>Resultados de {total}</S.SizeText>
      </S.SizeContainer>
    </S.Wrapper>
  );
};

export default Paginator;
