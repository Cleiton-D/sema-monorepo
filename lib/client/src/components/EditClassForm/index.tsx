import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from 'react-query';

import TextInput from 'components/TextInput';
import SchoolDayDatepicker from 'components/SchoolDayDatepicker';
import Select from 'components/Select';
import Button from 'components/Button';

import { useListSchoolSubjects } from './hooks';

import { Timetable } from 'models/Timetable';
import { Class } from 'models/Class';

import { useShowSchoolTermPeriod } from 'requests/queries/school-term-periods';
import { useListClassPeriods } from 'requests/queries/class-periods';
import {
  useListClassrooms,
  useShowClassroom
} from 'requests/queries/classrooms';
import { classesKeys } from 'requests/queries/class';
import { useShowGrade } from 'requests/queries/grades';
import {
  useProfile,
  useSessionSchoolYear,
  useUser
} from 'requests/queries/session';
import { useEditClass } from 'requests/mutations/classes';

import { generateTimetable } from 'utils/generateTimetable';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';
import {
  orderClassPeriods,
  translateDescription
} from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

type FormData = {
  taught_content: string;
  date: Date;
  school_subject: string;
  timetable: Timetable;
};

type TimesOptions = {
  title: string;
  items: Array<{ label: string; value: string }>;
};

type EditClassFormProps = {
  classEntity: Class;
};

const EditClassForm = ({ classEntity }: EditClassFormProps) => {
  const [saving, setSaving] = useState(false);

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

  const { data: schoolYear } = useSessionSchoolYear();
  const { data: profile } = useProfile();
  const { data: user } = useUser();

  const queryClient = useQueryClient();

  const editClass = useEditClass();

  const { data: classroom } = useShowClassroom({
    id: classEntity.classroom_id
  });
  const { data: grade } = useShowGrade(classroom?.grade_id);

  const { data: schoolSubjects, isLoading: isLoadingSchoolSubjects } =
    useListSchoolSubjects({
      isTeacher: profile?.access_level?.code === 'teacher',
      accessLevel: profile?.access_level?.code,
      userEmployeeId: user?.employee?.id,
      classroom_id: classEntity.classroom_id,
      school_id: profile?.school?.id,
      school_year_id: schoolYear?.id,
      include_multidisciplinary: true,
      is_multidisciplinary: grade?.is_multidisciplinary || undefined,
      grade_id: classroom?.grade_id
    });

  const { data: classrooms, isLoading: loadingClassrooms } = useListClassrooms({
    school_id: profile?.school?.id,
    employee_id: user?.employee?.id,
    with_in_multigrades: false,
    with_multigrades: true,
    school_year_id: schoolYear?.id
  });

  const { data: classPeriods, isLoading: loadingClassPeriods } =
    useListClassPeriods({
      school_id: profile?.school?.id,
      school_year_id: schoolYear?.id
    });

  const { data: schoolTermPeriod } = useShowSchoolTermPeriod({
    school_year_id: schoolYear?.id,
    contain_date: selectedDay,
    status: 'ACTIVE'
  });

  const handleSubmit = async (values: FormData) => {
    if (!schoolTermPeriod) return;

    setSaving(true);
    const requestData = {
      class_id: classEntity.id,
      school_subject_id: values.school_subject,
      period: values.timetable,
      class_date: selectedDay,
      taught_content: values.taught_content,
      school_term: schoolTermPeriod.school_term
    };

    await editClass.mutateAsync(requestData);
    queryClient.invalidateQueries(classesKeys.all);

    setSaving(false);
  };

  const timesOptions = useMemo(() => {
    if (loadingClassPeriods || !classPeriods)
      return [{ label: 'Carregando...', value: '' }];

    const sortedClassPeriods = orderClassPeriods(classPeriods);

    return sortedClassPeriods.reduce<TimesOptions[]>((acc, item) => {
      const { time_start, time_end, class_time, break_time, break_time_start } =
        item;

      const timetables = generateTimetable({
        time_start,
        time_end,
        class_time,
        break_time,
        break_time_start
      });

      const items = timetables.map(({ timeStart, timeEnd }) => {
        const value = `${timeStart} - ${timeEnd}`;

        return { label: value, value };
      });

      const translatedDescription = translateDescription(item.description);
      return [...acc, { title: translatedDescription, items }];
    }, []);
  }, [classPeriods, loadingClassPeriods]);

  const schoolSubjectsOptions = useMemo(() => {
    if (isLoadingSchoolSubjects) return [{ label: 'Carregando...', value: '' }];

    return schoolSubjects?.map((schoolSubject) => {
      return {
        label: schoolSubject.description,
        value: schoolSubject.id
      };
    });
  }, [isLoadingSchoolSubjects, schoolSubjects]);

  const classroomsOptions = useMemo(() => {
    if (loadingClassrooms) return [{ label: 'Carregando...', value: '' }];

    const filteredClassrooms = classrooms?.items || [];

    return filteredClassrooms?.map((classroom) => {
      return {
        label: classroom.description,
        value: classroom.id
      };
    });
  }, [loadingClassrooms, classrooms]);

  const initialData = useMemo(() => {
    const parsedDate = parseDateWithoutTimezone(classEntity.class_date);

    return {
      taught_content: classEntity.taught_content,
      classroom: classEntity.classroom_id,
      date: parsedDate,
      school_subject: classEntity.school_subject_id,
      timetable: classEntity.period
    };
  }, [classEntity]);

  useEffect(() => {
    const parsedDate = parseDateWithoutTimezone(classEntity.class_date);
    setSelectedDay(parsedDate);
  }, [classEntity.class_date, classEntity.classroom_id]);

  return (
    <S.Form onSubmit={handleSubmit} initialData={initialData}>
      <S.Grid>
        <S.GridItem>
          <SchoolDayDatepicker
            name="date"
            label="Data"
            selectedDay={selectedDay}
            handleChangeDate={setSelectedDay}
          />
        </S.GridItem>
        <S.GridItem>
          <Select name="timetable" label="Horário" options={timesOptions} />
        </S.GridItem>
        <S.GridItem>
          <Select
            name="classroom"
            label="Turma"
            options={classroomsOptions}
            disabled
          />
        </S.GridItem>
        <S.GridItem>
          <Select
            name="school_subject"
            label="Disciplina"
            options={schoolSubjectsOptions}
          />
        </S.GridItem>
      </S.Grid>
      <S.Divider />
      <S.InputContent>
        <strong>Conteúdo:</strong>
        <TextInput
          as="textarea"
          label="Descreva aqui o conteúdo que será aplicado nesta aula"
          name="taught_content"
        />
      </S.InputContent>
      <S.SaveButtonContainer>
        <Button styleType="normal" size="medium" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </S.SaveButtonContainer>
    </S.Form>
  );
};

export default EditClassForm;
