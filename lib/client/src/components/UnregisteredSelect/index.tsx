import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle
} from 'react';
import { v4 as uuidv4 } from 'uuid';

import UnregisteredTextInput from 'components/UnregisteredTextInput';

import * as S from './styles';
import useOnClickOutside from 'hooks/use-onclick-outside';

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
  error?: string;
  defaultValue?: any;
  size?: 'large' | 'medium' | 'small';
};

export type Orientation = 'bottom' | 'top';

export type UnregisteredSelectRef = {
  setValue(value: any): void;
};

const MAX_HEIGHT = 300;
const UnregisteredSelect: React.ForwardRefRenderFunction<
  UnregisteredSelectRef,
  SelectProps
> = (
  {
    name,
    label,
    options = [],
    selectedOption,
    className,
    emptyOption = false,
    disabled = false,
    error,
    defaultValue,
    size = 'large',
    onChange
  },
  ref
) => {
  // const [settedDefault, setSettedDefault] = useState(false);
  const [open, setOpen] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('bottom');

  const [optionSelected, setOptionSelected] = useState<Option>();
  const [previousSelected, setPreviousSelected] = useState<any>();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (typeof document === 'undefined') return;

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
    },
    [groupedOptions]
  );

  useEffect(() => {
    if (!selectedOption) {
      setValue(defaultValue);
    }
  }, [defaultValue, selectedOption, setValue]);

  useEffect(() => {
    if (selectedOption === previousSelected) return;

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

  useImperativeHandle(ref, () => ({ setValue }));

  useOnClickOutside(wrapperRef, () => {
    setOpen(false);
  });

  return (
    <S.Wrapper className={className} ref={wrapperRef}>
      <UnregisteredTextInput
        name={name}
        label={!open || orientation !== 'top' ? label : ''}
        unformRegister={false}
        readOnly
        onFocus={handleOpen}
        value={optionSelected?.label || ''}
        icon={<S.ArrowIcon isOpen={open} />}
        error={error}
        disabled={disabled}
        ref={inputRef}
        size={size}
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

export default forwardRef(UnregisteredSelect);
