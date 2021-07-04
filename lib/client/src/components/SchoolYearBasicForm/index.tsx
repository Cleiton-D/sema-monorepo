import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { Scope, FormHandles as UnformHandles } from '@unform/core';
import { Form } from '@unform/web';
import { addMonths, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import { ValidationError } from 'yup';

import DatePicker from 'components/Datepicker';
import Select from 'components/Select';

import { FormHandles } from 'models/Form';
import { SchoolYear } from 'models/SchoolYear';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import { schoolYearAtom } from 'store/atoms/school-year';

import { useCreateSchoolYearMudation } from 'requests/mutations/school-year';

import useAtomCallback from 'hooks/use-atom-callback';

import { schoolYearBasicSchema } from './rules/schema';

import * as S from './styles';

type DatesObject = {
  dateStart?: Date;
  dateEnd?: Date;
};

const referenceYearOptions = [
  { label: '2020', value: '2020' },
  { label: '2021', value: '2021' },
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' }
];

const SchoolYearBasicForm: React.ForwardRefRenderFunction<FormHandles> = (
  _,
  ref
) => {
  const [referenceYear, setReferenceYear] = useState<number>();

  const [schoolYear, setSchoolYear] = useState<DatesObject>({});
  const [first, setFirst] = useState<DatesObject>({});
  const [second, setSecond] = useState<DatesObject>({});
  const [third, setThird] = useState<DatesObject>({});
  const [fourth, setFourth] = useState<DatesObject>({});

  const [state, setState] = useAtom(schoolYearAtom);
  const mutation = useCreateSchoolYearMudation();

  const formRef = useRef<UnformHandles>(null);

  const handleChangeValue = useCallback(
    (
      fn: Dispatch<SetStateAction<DatesObject>>,
      key: keyof DatesObject,
      value?: Date
    ) => {
      fn((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const submitForm = useAtomCallback(async (get) => {
    const values = formRef.current?.getData();

    try {
      await schoolYearBasicSchema.validate(values, { abortEarly: false });

      const value = get(schoolYearAtom);
      const response = await mutation.mutateAsync({
        ...values,
        school_year_id: value?.schoolYear.id
      });

      const { schoolYear, schoolTermPeriods } = response as {
        schoolYear: SchoolYear;
        schoolTermPeriods: SchoolTermPeriod[];
      };

      setState({ schoolYear, schoolTermPeriods });
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationErrors: Record<string, string> = {};

        err.inner.forEach((error) => {
          console.log(error.path);
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });

        formRef.current?.setErrors(validationErrors);
      }

      throw err;
    }
  }, []);

  useImperativeHandle(ref, () => ({ submitForm }));

  const month = useMemo(
    () => new Date(referenceYear || new Date().getFullYear(), 0),
    [referenceYear]
  );

  const initialData = useMemo(() => {
    if (!state) return undefined;

    const { schoolYear, schoolTermPeriods } = state;

    const school_year = {
      reference_year: schoolYear.reference_year,
      date_start: parseISO(schoolYear.date_start),
      date_end: parseISO(schoolYear.date_end)
    };

    const school_terms = schoolTermPeriods.reduce((acc, item) => {
      const key = item.school_term;
      const value = {
        date_start: parseISO(item.date_start),
        date_end: parseISO(item.date_end)
      };

      return { ...acc, [key]: value };
    }, {});

    return { school_year, school_terms };
  }, [state]);

  return (
    <S.Wrapper>
      <Form
        onSubmit={() => console.log('Sending form data')}
        ref={formRef}
        initialData={initialData}
      >
        <S.BasicContainer>
          <Scope path="school_year">
            <Select
              name="reference_year"
              label="Ano referência"
              onChange={setReferenceYear}
              options={referenceYearOptions}
            />
            <DatePicker
              name="date_start"
              label="Data de Início"
              toDate={schoolYear.dateEnd}
              month={month}
              onChangeDay={(date) =>
                handleChangeValue(setSchoolYear, 'dateStart', date)
              }
            />
            <DatePicker
              name="date_end"
              label="Data de Término"
              fromDate={schoolYear.dateStart}
              month={month}
              onChangeDay={(date) =>
                handleChangeValue(setSchoolYear, 'dateEnd', date)
              }
              initialMonth={
                schoolYear.dateStart && addMonths(schoolYear.dateStart, 10)
              }
            />
          </Scope>
        </S.BasicContainer>

        <S.TermPeriodsContainer>
          <S.SectionTitle>Bimestres</S.SectionTitle>
          <section>
            <Scope path="school_terms">
              <S.TermPeriod>
                <legend>1º Bimestre</legend>
                <S.TermPeriodFields>
                  <Scope path="FIRST">
                    <DatePicker
                      name="date_start"
                      label="Data de Início"
                      fromDate={schoolYear.dateStart}
                      toDate={schoolYear.dateEnd}
                      month={month}
                      value={schoolYear.dateStart}
                      onChangeDay={(date) =>
                        handleChangeValue(setFirst, 'dateStart', date)
                      }
                      disabled
                    />
                    <DatePicker
                      name="date_end"
                      label="Data de Término"
                      fromDate={schoolYear.dateStart}
                      toDate={schoolYear.dateEnd}
                      month={month}
                      initialMonth={schoolYear.dateStart}
                      onChangeDay={(date) =>
                        handleChangeValue(setFirst, 'dateEnd', date)
                      }
                    />
                  </Scope>
                </S.TermPeriodFields>
              </S.TermPeriod>
              <S.TermPeriod>
                <legend>2º Bimestre</legend>
                <S.TermPeriodFields>
                  <Scope path="SECOND">
                    <DatePicker
                      name="date_start"
                      label="Data de Início"
                      fromDate={first.dateEnd}
                      toDate={schoolYear.dateEnd}
                      month={month}
                      initialMonth={first.dateEnd}
                      onChangeDay={(date) =>
                        handleChangeValue(setSecond, 'dateStart', date)
                      }
                    />
                    <DatePicker
                      name="date_end"
                      label="Data de Término"
                      fromDate={second.dateStart}
                      toDate={schoolYear.dateEnd}
                      initialMonth={second.dateStart}
                      month={month}
                      onChangeDay={(date) =>
                        handleChangeValue(setSecond, 'dateEnd', date)
                      }
                    />
                  </Scope>
                </S.TermPeriodFields>
              </S.TermPeriod>
              <S.TermPeriod>
                <legend>3º Bimestre</legend>
                <S.TermPeriodFields>
                  <Scope path="THIRD">
                    <DatePicker
                      name="date_start"
                      label="Data de Início"
                      fromDate={second.dateEnd}
                      toDate={schoolYear.dateEnd}
                      month={month}
                      initialMonth={second.dateEnd}
                      onChangeDay={(date) =>
                        handleChangeValue(setThird, 'dateStart', date)
                      }
                    />
                    <DatePicker
                      name="date_end"
                      label="Data de Término"
                      fromDate={third.dateStart}
                      toDate={schoolYear.dateEnd}
                      month={month}
                      initialMonth={third.dateStart}
                      onChangeDay={(date) =>
                        handleChangeValue(setThird, 'dateEnd', date)
                      }
                    />
                  </Scope>
                </S.TermPeriodFields>
              </S.TermPeriod>
              <S.TermPeriod>
                <legend>4º Bimestre</legend>
                <S.TermPeriodFields>
                  <Scope path="FOURTH">
                    <DatePicker
                      name="date_start"
                      label="Data de Início"
                      fromDate={third.dateEnd}
                      toDate={schoolYear.dateEnd}
                      month={month}
                      initialMonth={third.dateEnd}
                      onChangeDay={(date) =>
                        handleChangeValue(setFourth, 'dateStart', date)
                      }
                    />
                    <DatePicker
                      name="date_end"
                      label="Data de Término"
                      fromDate={fourth.dateStart}
                      toDate={schoolYear.dateEnd}
                      month={month}
                      initialMonth={fourth.dateStart}
                      value={schoolYear.dateEnd}
                      onChangeDay={(date) =>
                        handleChangeValue(setFourth, 'dateEnd', date)
                      }
                      disabled
                    />
                  </Scope>
                </S.TermPeriodFields>
              </S.TermPeriod>
            </Scope>
          </section>
        </S.TermPeriodsContainer>
      </Form>
    </S.Wrapper>
  );
};

export default forwardRef(SchoolYearBasicForm);
