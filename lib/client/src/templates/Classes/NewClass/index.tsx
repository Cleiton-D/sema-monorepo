import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import Select from 'components/Select';
import DatePicker from 'components/Datepicker';

import { DayOfWeek, DayOfWeekEnum } from 'models/DafOfWeek';
import { Timetable } from 'models/Timetable';

import { useListTimetables } from 'requests/queries/timetables';
import { useListSchoolsSubjects } from 'requests/queries/school-subjects';
import { useListClassrooms } from 'requests/queries/classrooms';
import { useListClassPeriods } from 'requests/queries/class-periods';
import { useShowSchoolTermPeriod } from 'requests/queries/school-term-periods';
import { useCreateClass } from 'requests/mutations/classes';

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
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | undefined>(
    DayOfWeekEnum[currentDay] as DayOfWeek
  );
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<Timetable>();
  const [selectedSchoolSubject, setSelectedSchoolSubject] = useState<string>();
  const [selectedClassroom, setSelectedClassroom] = useState<string>();

  const { push } = useRouter();
  const { data: session } = useSession();

  const { data: timetables } = useListTimetables(session, {
    school_id: session?.schoolId,
    employee_id: session?.user.employeeId,
    day_of_week: dayOfWeek
  });

  const { data: schoolSubjects, isLoading: loadingSchoolSubjects } =
    useListSchoolsSubjects(session, {
      grade_id: selectedTime?.classroom?.grade_id,
      school_year_id: selectedTime?.classroom?.school_year_id
    });

  const { data: classrooms, isLoading: loadingClassrooms } = useListClassrooms(
    session,
    {
      school_id: session?.schoolId
    }
  );

  const { data: classPeriods, isLoading: loadingClassPeriods } =
    useListClassPeriods(session);

  const { data: schoolTermPeriod } = useShowSchoolTermPeriod(session, {
    school_year_id: session?.configs.school_year_id,
    status: 'ACTIVE'
  });

  const createClass = useCreateClass();

  const handleSubmit = async (values: FormData) => {
    const { timetable } = values;

    if (!schoolTermPeriod) return;

    const requestData = {
      classroom_id: values.classroom,
      school_subject_id: values.school_subject,
      period: timetable,
      class_date: values.date,
      taught_content: values.taught_content,
      school_term: schoolTermPeriod.school_term
    };

    const classEntity = await createClass.mutateAsync(requestData);
    push(`/auth/classes/${classEntity.id}`);
  };

  const handleChangeDate = (date?: Date) => {
    setSelectedDay(date);
    setSelectedTime(undefined);
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

    setSelectedTime(selectedTimetable);

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
    if (loadingSchoolSubjects) return [{ label: 'Carregando...', value: '' }];

    return schoolSubjects?.map((schoolSubject) => {
      return {
        label: schoolSubject.description,
        value: schoolSubject.id
      };
    });
  }, [loadingSchoolSubjects, schoolSubjects]);

  const classroomsOptions = useMemo(() => {
    if (loadingClassrooms) return [{ label: 'Carregando...', value: '' }];

    return classrooms?.map((classroom) => {
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
              <DatePicker
                name="date"
                label="Data"
                value={selectedDay}
                onChangeDay={handleChangeDate}
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
            <Button styleType="normal" size="medium">
              Iniciar aula
            </Button>
          </S.SaveButtonContainer>
        </S.Form>
      </S.Wrapper>
    </Base>
  );
};

export default NewClass;
