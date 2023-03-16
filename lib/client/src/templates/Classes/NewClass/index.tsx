import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import Select from 'components/Select';
import SchoolDayDatepicker from 'components/SchoolDayDatepicker';

import { DayOfWeek, DayOfWeekEnum } from 'models/DafOfWeek';
import { Timetable } from 'models/Timetable';

import { useListTimetables } from 'requests/queries/timetables';
import { useListClassrooms } from 'requests/queries/classrooms';
import { useListClassPeriods } from 'requests/queries/class-periods';
import { useShowSchoolTermPeriod } from 'requests/queries/school-term-periods';
import { useCreateClass } from 'requests/mutations/classes';

import { useListSchoolSubjects } from 'components/SearchClasses/hooks';

import { masks } from 'utils/masks';
import {
  orderClassPeriods,
  translateDescription
} from 'utils/mappers/classPeriodMapper';
import { generateTimetable } from 'utils/generateTimetable';

import * as S from './styles';

type FormData = {
  taught_content: string;
  classroom: string;
  date: Date;
  school_subject: string;
  timetable: Timetable;
};

type TimesOptions = {
  title: string;
  items: Array<{ label: string; value: string }>;
};

const currentDay = new Date().getDay();
const NewClass = () => {
  const [saving, setSaving] = useState(false);

  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | undefined>(
    DayOfWeekEnum[currentDay] as DayOfWeek
  );
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [selectedSchoolSubject, setSelectedSchoolSubject] = useState<string>();
  const [selectedClassroom, setSelectedClassroom] = useState<string>();

  const { push } = useRouter();
  const { data: session } = useSession();

  const { data: timetables } = useListTimetables(session, {
    school_id: session?.schoolId,
    employee_id: session?.user.employeeId,
    day_of_week: dayOfWeek
  });

  const { data: schoolSubjects, isLoading: isLoadingSchoolSubjects } =
    useListSchoolSubjects(session, {
      classroom_id: selectedClassroom,
      school_id: session?.schoolId,
      school_year_id: session?.configs.school_year_id
    });

  const { data: classrooms, isLoading: loadingClassrooms } = useListClassrooms(
    session,
    {
      school_id: session?.schoolId,
      employee_id: session?.user.employeeId,
      school_year_id: session?.configs.school_year_id,
      with_in_multigrades: false,
      with_multigrades: true
    }
  );

  const { data: classPeriods, isLoading: loadingClassPeriods } =
    useListClassPeriods(session, {
      school_id: session?.schoolId,
      school_year_id: session?.configs.school_year_id
    });

  const { data: schoolTermPeriod } = useShowSchoolTermPeriod(session, {
    school_year_id: session?.configs.school_year_id,
    contain_date: selectedDay,
    status: 'ACTIVE'
  });

  const createClass = useCreateClass();

  const handleSubmit = async (values: FormData) => {
    const { timetable } = values;

    setSaving(true);
    const requestData = {
      classroom_id: values.classroom,
      school_subject_id: values.school_subject,
      period: timetable,
      class_date: values.date,
      taught_content: values.taught_content
    };

    createClass
      .mutateAsync(requestData)
      .then((classEntity) => {
        push(`/auth/classes/${classEntity.id}`);
      })
      .finally(() => setSaving(false));
  };

  const handleChangeDate = (date?: Date) => {
    setSelectedDay(date);
    setSelectedSchoolSubject(undefined);
    setSelectedClassroom(undefined);

    if (!date) {
      setDayOfWeek(undefined);
      return;
    }

    const day = date.getDay();
    setDayOfWeek(DayOfWeekEnum[day] as DayOfWeek);
  };

  const handleChangeTime = (value: string) => {
    const selectedTimetable = timetables?.find((timetable) => {
      const timeStart = masks.time(timetable.time_start);
      const timeEnd = masks.time(timetable.time_end);
      const label = `${timeStart} - ${timeEnd}`;

      return label === value;
    });

    if (selectedTimetable) {
      setSelectedSchoolSubject(selectedTimetable?.school_subject_id);
      setSelectedClassroom(selectedTimetable?.classroom_id);
    }
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

    const classroomsItems = classrooms?.items || [];

    return classroomsItems.map((classroom) => {
      return {
        label: classroom.description,
        value: classroom.id
      };
    });
  }, [loadingClassrooms, classrooms]);

  return (
    <Base>
      <Heading>Iniciar aula</Heading>
      <S.Wrapper>
        <S.SectionTitle>
          <h4>{schoolTermPeriod?.translatedDescription}</h4>
        </S.SectionTitle>
        <S.Form onSubmit={handleSubmit}>
          <S.Grid>
            <S.GridItem>
              <SchoolDayDatepicker
                name="date"
                label="Data"
                selectedDay={selectedDay}
                handleChangeDate={handleChangeDate}
              />
            </S.GridItem>
            <S.GridItem>
              <Select
                name="timetable"
                label="Horário"
                options={timesOptions}
                onChange={handleChangeTime}
              />
            </S.GridItem>
            <S.GridItem>
              <Select
                name="classroom"
                label="Turma"
                options={classroomsOptions}
                selectedOption={selectedClassroom}
                onChange={setSelectedClassroom}
              />
            </S.GridItem>
            <S.GridItem>
              <Select
                name="school_subject"
                label="Disciplina"
                options={schoolSubjectsOptions}
                selectedOption={selectedSchoolSubject}
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
              {saving ? 'Salvando...' : 'Iniciar aula'}
            </Button>
          </S.SaveButtonContainer>
        </S.Form>
      </S.Wrapper>
    </Base>
  );
};

export default NewClass;
