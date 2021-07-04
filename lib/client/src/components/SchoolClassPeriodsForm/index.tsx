import {
  forwardRef,
  useState,
  useImperativeHandle,
  useMemo,
  useEffect,
  useRef
} from 'react';
import { useSession } from 'next-auth/client';
import { useAtomValue } from 'jotai/utils';
import { Flip, toast } from 'react-toastify';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Checkbox from 'components/Checkbox';
import ToastContent from 'components/ToastContent';

import { useListSchools } from 'requests/queries/schools';
import { useListClassPeriods } from 'requests/queries/class-periods';
import { useListSchoolClassPeriods } from 'requests/queries/school-class-periods';
import { useDefineSchoolClassPeriods } from 'requests/mutations/school-class-periods';

import useAtomCallback from 'hooks/use-atom-callback';

import { schoolYearAtom } from 'store/atoms/school-year';

import { FormHandles } from 'models/Form';
import { SchoolWithEnrollCount } from 'models/School';

import * as S from './styles';

type ClassPeriodSelected = Record<string, boolean>;

const SchoolClassPeriodsForm: React.ForwardRefRenderFunction<FormHandles> = (
  _,
  ref
) => {
  const [selectedItemsState, setSelectedItemsState] = useState<
    Record<string, ClassPeriodSelected>
  >({});
  const selectedItemsRef = useRef<Record<string, ClassPeriodSelected>>({});

  const [session] = useSession();
  const schoolYearAtomValue = useAtomValue(schoolYearAtom);

  const { data: schools } = useListSchools(session);
  const { data: classPeriods } = useListClassPeriods(session, {
    school_year_id: schoolYearAtomValue?.schoolYear.id
  });
  const { data: schoolClassPeriods } = useListSchoolClassPeriods(session, {
    school_year_id: schoolYearAtomValue?.schoolYear.id
  });

  const handleSelectOption = (
    schoolId: string,
    period: string,
    selected: boolean
  ) => {
    setSelectedItemsState((current) => {
      const thisSchool = current[schoolId];
      const newSchool = { ...thisSchool, [period]: selected };

      return { ...current, [schoolId]: newSchool };
    });
  };

  const defineSchoolClassPeriods = useDefineSchoolClassPeriods({
    showToasts: false
  });

  const submitForm = useAtomCallback(async (get) => {
    const schoolYearValue = get(schoolYearAtom);
    if (!schoolYearValue) return;

    const selected = selectedItemsRef.current;

    const toastKey = 'define-school-class-periods';
    try {
      toast.info(<ToastContent showSpinner>Salvando...</ToastContent>, {
        position: toast.POSITION.TOP_RIGHT,
        toastId: toastKey,
        autoClose: false,
        closeButton: false
      });

      const promises = Object.entries(selected).map(([key, value]) => {
        const selectedOptions = Object.entries(value)
          .filter(([, itemValue]) => itemValue)
          .map(([key]) => key);

        return defineSchoolClassPeriods.mutateAsync({
          school_id: key,
          class_periods: selectedOptions,
          school_year_id: schoolYearValue.schoolYear.id
        });
      });

      const result = await Promise.all(promises);

      toast.update(toastKey, {
        type: toast.TYPE.SUCCESS,
        render: 'Alterações registradas com sucesso.',
        autoClose: 3000,
        transition: Flip
      });

      return result;
    } catch (err) {
      toast.update(toastKey, {
        type: toast.TYPE.ERROR,
        render: 'Falha ao salvar alterações',
        autoClose: 3000,
        transition: Flip
      });

      throw err;
    }
  }, []);

  useImperativeHandle(ref, () => ({
    submitForm
  }));

  const selectedItems = useMemo(() => {
    if (!schools || !classPeriods || !schoolClassPeriods) return {};

    return schools.reduce<Record<string, ClassPeriodSelected>>(
      (acc, school) => {
        const schoolKey = school.id;

        const classPeriodsOfThis = classPeriods.reduce<ClassPeriodSelected>(
          (classPrdacc, classPeriod) => {
            const classPeriodKey = classPeriod.description;
            const existentLink = schoolClassPeriods.find(
              (item) =>
                item.school_id === schoolKey &&
                item.class_period_id === classPeriod.id
            );

            return { ...classPrdacc, [classPeriodKey]: !!existentLink };
          },
          {}
        );

        return { ...acc, [schoolKey]: classPeriodsOfThis };
      },
      {}
    );
  }, [classPeriods, schoolClassPeriods, schools]);

  useEffect(() => {
    setSelectedItemsState((current) => {
      const isEmpty =
        Object.keys(current).length === 0 && current.constructor === Object;

      if (isEmpty) return { ...selectedItems };

      return current;
    });
  }, [selectedItems]);

  useEffect(() => {
    selectedItemsRef.current = selectedItemsState;
  }, [selectedItemsState]);

  return (
    <S.Wrapper>
      <S.TableSection>
        <S.SectionTitle>
          {/* &lt;&gt; sao entities para os caracteres < > pois esses sao caracteres reservados no react */}
          <h4>Escola &lt;&gt; Períodos</h4>
        </S.SectionTitle>
        <Table<SchoolWithEnrollCount>
          items={schools || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn label="Nome da escola" tableKey="name" open={true}>
            {(school: SchoolWithEnrollCount) => (
              <S.ClassPeriodsContainer>
                {classPeriods?.map((classPeriod) => (
                  <li key={classPeriod.id}>
                    <Checkbox
                      label={classPeriod.translated_description}
                      labelFor={`${school.id}_${classPeriod.id}`}
                      onCheck={(isChecked) =>
                        handleSelectOption(
                          school.id,
                          classPeriod.description,
                          isChecked
                        )
                      }
                      isChecked={
                        selectedItemsState[school.id] &&
                        selectedItemsState[school.id][classPeriod.description]
                      }
                    />
                  </li>
                ))}
              </S.ClassPeriodsContainer>
            )}
          </TableColumn>

          <TableColumn label="Código do INEP" tableKey="inep_code" />
        </Table>
      </S.TableSection>
    </S.Wrapper>
  );
};

export default forwardRef(SchoolClassPeriodsForm);
