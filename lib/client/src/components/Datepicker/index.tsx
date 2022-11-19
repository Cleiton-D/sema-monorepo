import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {
  LocaleUtils,
  DayPickerInputProps,
  RangeModifier
} from 'react-day-picker';
import { X } from '@styled-icons/feather';
import { useField } from '@unform/core';
import format from 'date-fns/format';
import isEqual from 'date-fns/isEqual';
import ptBr from 'date-fns/locale/pt-BR';
import { v4 as uuidv4 } from 'uuid';

import 'react-day-picker/lib/style.css';

import TextInput, { TextInputProps } from 'components/TextInput';

import * as S from './styles';

const SHORT_WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

type DatePickerProps = DayPickerInputProps & {
  name: string;
  label: string;
  initialMonth?: Date;
  fromDate?: Date;
  toDate?: Date;
  month?: Date;
  disabled?: boolean;
  value?: Date;
  disabledRanges?: RangeModifier[];
  exceptEnabledDays?: Date[];
  disabledDays?: Date[];
  onChangeDay?: (date?: Date) => void;
};

const DatePicker = ({
  name,
  label,
  initialMonth,
  fromDate,
  toDate,
  month,
  value,
  disabled = false,
  exceptEnabledDays = [],
  disabledDays = [],
  disabledRanges = [],
  onChangeDay = () => null
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState(uuidv4());

  const selectedDateRef = useRef<{ value?: Date }>({ value: undefined });

  const { registerField, fieldName, defaultValue, error } = useField(name);

  const handleSelectDay = useCallback(
    (value: Date) => {
      const formattedDate = format(value, 'dd/MM/yyyy');
      setInputText(formattedDate);
      setSelectedDate(value);

      onChangeDay && onChangeDay(value);
    },
    [onChangeDay]
  );

  const formatMonthTitle = useCallback(
    (date: Date) => format(date, "MMMM 'de' yyyy", { locale: ptBr }),
    []
  );

  const handleClear = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      event.preventDefault();

      setInputText('');
      setSelectedDate(undefined);
      setKey(uuidv4());

      onChangeDay && onChangeDay(undefined);
    },
    [onChangeDay]
  );

  const handleValidateDay = useCallback(
    (date: Date) => {
      date.setHours(0, 0, 0, 0);
      const isException = exceptEnabledDays.some((item) => {
        item.setHours(0, 0, 0, 0);
        return isEqual(date, item);
      });
      if (isException) return false;

      const isDisabled = disabledDays.some((item) => {
        item.setHours(0, 0, 0, 0);
        return isEqual(date, item);
      });
      if (isDisabled) return true;

      const dayOfWeek = date.getDay();
      return [0, 6].includes(dayOfWeek);
    },
    [disabledDays, exceptEnabledDays]
  );

  const InputComponent = useMemo(
    () =>
      forwardRef<HTMLInputElement, TextInputProps>(function Input(props, ref) {
        return (
          <TextInput
            ref={ref}
            {...props}
            name={fieldName}
            label={label}
            unformRegister={false}
            readOnly
            disabled={disabled}
            value={inputText}
            error={error}
            icon={
              selectedDate && (
                <X style={{ cursor: 'pointer' }} onClick={handleClear} />
              )
            }
          />
        );
      }),
    [inputText, fieldName, selectedDate, handleClear, label, disabled, error]
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectedDateRef,
      getValue: (ref) => ref.current.value,
      setValue: (_, value: Date) => handleSelectDay(value)
    });
  }, [registerField, fieldName, handleSelectDay]);

  useEffect(() => {
    selectedDateRef.current.value = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    const newValue = value || defaultValue;

    if (newValue && newValue instanceof Date) {
      const formattedDate = format(newValue, 'dd/MM/yyyy');
      setInputText(formattedDate);
      setSelectedDate(newValue);
    } else {
      setInputText('');
      setSelectedDate(undefined);
    }
  }, [defaultValue, value]);

  return (
    <S.Wrapper>
      <DayPickerInput
        component={InputComponent}
        onDayChange={handleSelectDay}
        key={key}
        placeholder=""
        inputProps={{
          readOnly: true
        }}
        dayPickerProps={{
          weekdaysShort: SHORT_WEEKDAYS,
          localeUtils: { ...LocaleUtils, formatMonthTitle },
          selectedDays: selectedDate,
          initialMonth,
          fromMonth: fromDate,
          toMonth: toDate,
          month,
          disabledDays: [
            handleValidateDay,
            ...disabledRanges,
            fromDate && { before: fromDate },
            toDate && { after: toDate }
          ]
          // disabledDays: {
          //   before: fromDate,
          //   after: toDate,
          //   daysOfWeek: [0, 6]
          // }
        }}
      />
    </S.Wrapper>
  );
};

export default DatePicker;
