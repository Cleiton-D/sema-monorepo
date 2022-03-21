import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useField } from '@unform/core';
import { v4 as uuidv4 } from 'uuid';

import TextInput from 'components/TextInput';

import * as S from './styles';

export type Option = {
  label: string;
  value: any;
};

export type OptionGroup = {
  title: string;
  items: Option[];
};

type SelectProps = {
  label: string;
  name: string;
  options?: Array<Option | OptionGroup>;
  selectedOption?: any;
  emptyOption?: boolean;
  onChange?: (value?: any) => void;
  className?: string;
  disabled?: boolean;
};

export type Orientation = 'bottom' | 'top';

const MAX_HEIGHT = 300;
const Select = ({
  name,
  label,
  options = [],
  selectedOption,
  className,
  emptyOption = false,
  disabled = false,
  onChange
}: SelectProps) => {
  // const [settedDefault, setSettedDefault] = useState(false);
  const [open, setOpen] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('bottom');

  const [optionSelected, setOptionSelected] = useState<Option>();
  const [previousSelected, setPreviousSelected] = useState<any>();

  const selectedOptionValue = useRef<Option | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { defaultValue, fieldName, registerField, error } = useField(name);

  const groupedOptions = useMemo(() => {
    const emptyKey = uuidv4();

    const newOptions = options.reduce<Record<string, Option[]>>((acc, item) => {
      const alreadyGrouped = Object.prototype.hasOwnProperty.call(
        item,
        'items'
      );

      const title = !alreadyGrouped ? emptyKey : (item as OptionGroup).title;
      const items = !alreadyGrouped
        ? [item as Option]
        : (item as OptionGroup).items;

      const currentItems = acc[title] || [];

      return { ...acc, [title]: [...currentItems, ...items] };
    }, {});

    const { [emptyKey]: emptyItems, ...restItems } = newOptions;
    const mappedItems = Object.entries(restItems).map(([key, value]) => ({
      key,
      title: key,
      items: value
    }));

    if (!emptyItems?.length) return mappedItems;

    const emptyObject = {
      key: emptyKey,
      title: undefined,
      items: emptyItems
    };

    return [emptyObject, ...mappedItems];
  }, [options]);

  const handleOpen = () => {
    if (containerRef.current && inputRef.current) {
      const boundingRect = inputRef.current.getBoundingClientRect();

      const windowBottom =
        window.innerHeight || document.documentElement.clientHeight;

      const distanceFromTop = boundingRect.top - 85;
      const distanceFromBottom = windowBottom - boundingRect.bottom - 10;

      const elementHeight = Math.min(
        MAX_HEIGHT,
        containerRef.current.scrollHeight
      );

      const limit = elementHeight * 1.5;

      if (distanceFromBottom < limit) {
        if (distanceFromTop < limit && distanceFromTop < distanceFromBottom) {
          setOrientation('bottom');
        } else {
          setOrientation('top');
        }
      } else {
        setOrientation('bottom');
      }

      const distance = Math.max(distanceFromTop, distanceFromBottom);
      const height = Math.min(MAX_HEIGHT, distance);
      const heightInRem = height / 10;

      containerRef.current.style.setProperty('max-height', `${heightInRem}rem`);
    }

    setOpen(true);
  };

  const handleChange = (option?: Option) => {
    setOptionSelected(option);
    selectedOptionValue.current = option?.value;
    onChange && onChange(option?.value);

    setOpen(false);
  };

  const handleAnimate = useCallback((event: AnimationEvent) => {
    if (event.animationName === 'SlideOut') {
      const element = event.target as HTMLElement;
      element.style.removeProperty('max-height');
    }
  }, []);

  const setValue = useCallback(
    (value?: any) => {
      const optionsList = groupedOptions.reduce<Option[]>(
        (acc, item) => [...acc, ...item.items],
        []
      );

      const option = optionsList.find((option) => option.value === value);
      setOptionSelected(option);
      selectedOptionValue.current = option ? value : undefined;
    },
    [groupedOptions]
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectedOptionValue,
      getValue: (ref) => ref.current,
      setValue: (_, value) => setValue(value)
    });
  }, [registerField, fieldName, setValue]);

  useEffect(() => {
    if (!selectedOption) {
      setValue(defaultValue);
      // setSettedDefault(true);
    }
  }, [defaultValue, selectedOption, setValue]);

  useEffect(() => {
    console.log('this', selectedOption, previousSelected);
    if (selectedOption === previousSelected) return;

    console.log('aqui', selectedOption);

    setValue(selectedOption);
    setPreviousSelected(selectedOption);
  }, [setValue, selectedOption, previousSelected]);

  useEffect(() => {
    setPreviousSelected(undefined);
  }, [groupedOptions]);

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

  return (
    <S.Wrapper className={className} ref={wrapperRef}>
      <TextInput
        name={name}
        label={!open || orientation !== 'top' ? label : ''}
        unformRegister={false}
        readOnly
        onFocus={handleOpen}
        onBlur={() => setOpen(false)}
        value={optionSelected?.label || ''}
        icon={<S.ArrowIcon isOpen={open} />}
        error={error}
        disabled={disabled}
        ref={inputRef}
      />
      <S.OptionsList
        isOpen={open}
        orientation={orientation}
        ref={containerRef}
        onScroll={(event) => event.stopPropagation()}
      >
        {emptyOption && (
          <S.EmptyOption
            onClick={() => handleChange(undefined)}
            disabled={disabled}
          >
            &nbsp;
          </S.EmptyOption>
        )}
        {groupedOptions.map(({ title, key, items }) => (
          <S.GroupContainer key={key} hasTitle={!!title}>
            {!!title && <span>{title}</span>}
            {items.map((option) => (
              <S.Option
                key={`${key}-${option.label}-${JSON.stringify(option.value)}`}
                onClick={() => handleChange(option)}
                disabled={disabled}
              >
                {option.label}
              </S.Option>
            ))}
          </S.GroupContainer>
        ))}
      </S.OptionsList>
    </S.Wrapper>
  );
};

export default Select;
