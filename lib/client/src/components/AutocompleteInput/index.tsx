import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useField } from '@unform/core';
import { useQuery } from 'react-query';
import dot from 'dot-object';
import debounce from 'lodash.debounce';

import TextInput from 'components/TextInput';

import * as S from './styles';

type AutocompleteFieldProps<T> = {
  label: string;
  name: string;
  emptyOption?: boolean;
  className?: string;
  disabled?: boolean;
  queryFn: (filters?: Record<string, unknown>) => Promise<T[]>;
  valuePath: string;
  labelPath: string;
  searchBy: string | string[];
  formatter?: (item: T) => string;
  placeholder?: string;
  onChangeOption?: (value?: any) => void;
};

export type Orientation = 'bottom' | 'top';

const MAX_HEIGHT = 300;
function AutocompleteField<T>({
  name,
  label,
  className,
  emptyOption = false,
  disabled = false,
  queryFn,
  labelPath,
  valuePath,
  searchBy,
  placeholder,
  formatter,
  onChangeOption
}: AutocompleteFieldProps<T>) {
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');

  const [open, setOpen] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('bottom');

  const [selectedOption, setSelectedOption] = useState<T>();

  const selectedOptionValue = useRef<T | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { fieldName, registerField, error } = useField(name);

  const queryKey = useMemo(() => {
    return `autocomplete-${JSON.stringify(
      searchBy
    )}-${labelPath}-${valuePath}-${search}`;
  }, [labelPath, searchBy, valuePath, search]);
  const queryFilters = useMemo(() => {
    const searchByArr = Array.isArray(searchBy) ? searchBy : [searchBy];

    return searchByArr.reduce((acc, item) => ({ ...acc, [item]: search }), {});
  }, [searchBy, search]);

  const { data: options = [], isFetching } = useQuery(
    queryKey,
    () => queryFn(queryFilters),
    {
      enabled: !!search && search !== '',
      retry: false
    }
  );

  const handleOpen = () => {
    if (containerRef.current && inputRef.current) {
      const boundingRect = inputRef.current.getBoundingClientRect();
      const windowBottom =
        window.innerHeight || document.documentElement.clientHeight;

      const elementHeight = Math.min(
        MAX_HEIGHT,
        containerRef.current.scrollHeight
      );

      const limit = elementHeight * 1.5;
      const distanceFromBottom = windowBottom - boundingRect.bottom;

      if (distanceFromBottom < limit) {
        setOrientation('top');
      } else {
        setOrientation('bottom');
      }
    }

    if (containerRef.current) {
      const height = MAX_HEIGHT / 10;
      containerRef.current.style.setProperty('max-height', `${height}rem`);
    }

    setOpen(true);
  };

  const handleSearch = useCallback((value: string) => {
    const searchValue = value.length >= 3 ? value : '';
    setSearch(searchValue);
  }, []);

  const handleChange = (option?: T) => {
    setSelectedOption(option);

    const finalValue = option ? dot.pick(valuePath, option) : undefined;
    selectedOptionValue.current = finalValue;

    if (onChangeOption) {
      onChangeOption(finalValue);
    }

    setOpen(false);
  };

  const handleAnimate = useCallback((event: AnimationEvent) => {
    if (event.animationName === 'SlideOut') {
      const element = event.target as HTMLElement;
      element.style.removeProperty('max-height');
    }
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectedOptionValue,
      getValue: (ref) => ref.current
    });
  }, [registerField, fieldName, selectedOption]);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.addEventListener('animationend', handleAnimate);
    }
    return () => {
      if (element) {
        element.removeEventListener('animationend', handleAnimate);
      }
    };
  }, [handleAnimate]);

  useEffect(() => {
    if (selectedOption) {
      const label = formatter
        ? formatter(selectedOption)
        : dot.pick(labelPath, selectedOption);
      setInputValue(label);
    } else {
      setInputValue('');
    }
  }, [formatter, labelPath, selectedOption, valuePath]);

  const optionList = useMemo(() => {
    if (!search || search === '') {
      return [
        { label: placeholder || 'Pesquisar.', value: '', entity: undefined }
      ];
    }

    if (isFetching)
      return [{ label: 'Carregando...', value: '', entity: undefined }];
    if (!options.length) {
      return [
        { label: 'Nenhum resultado encontrado', value: '', entity: undefined }
      ];
    }

    return options.map((item) => {
      const value = dot.pick(valuePath, item);
      const label = formatter ? formatter(item) : dot.pick(labelPath, item);

      return {
        label,
        value,
        entity: item
      };
    }, []);
  }, [
    search,
    isFetching,
    options,
    placeholder,
    valuePath,
    formatter,
    labelPath
  ]);

  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch]
  );

  const handleInputChange = useCallback(
    (value?: string) => {
      setInputValue(value || '');
      debouncedHandleSearch(value || '');
    },
    [debouncedHandleSearch]
  );

  return (
    <S.Wrapper className={className} ref={wrapperRef}>
      <TextInput
        name={name}
        label={!open || orientation !== 'top' ? label : ''}
        unformRegister={false}
        onFocus={handleOpen}
        onBlur={() => setOpen(false)}
        onChangeValue={handleInputChange}
        icon={open && isFetching ? <S.LoaderIcon /> : <S.SearchIcon />}
        error={error}
        disabled={disabled}
        value={inputValue}
        ref={inputRef}
      />
      <S.OptionsList isOpen={open} orientation={orientation} ref={containerRef}>
        {emptyOption && !isFetching && options.length ? (
          <S.EmptyOption
            onClick={() => handleChange(undefined)}
            disabled={disabled}
          >
            &nbsp;
          </S.EmptyOption>
        ) : (
          <></>
        )}
        {optionList.map(({ label, value, entity }) => (
          <S.Option
            key={`${label}-${value}`}
            onClick={() => handleChange(entity)}
            disabled={disabled}
          >
            {label}
          </S.Option>
        ))}
      </S.OptionsList>
    </S.Wrapper>
  );
}

export default AutocompleteField;
