import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import ToastContent from 'components/ToastContent';

import { Classroom } from 'models/Classroom';
import { Timetable } from 'models/Timetable';
import { DayOfWeek } from 'models/DafOfWeek';

import { useListSchoolsSubjects } from 'requests/queries/school-subjects';
import { useListSchoolTeachers } from 'requests/queries/school-teachers';
import { validateTimetable } from 'requests/queries/timetables';
import { useListClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';
import { useShowGrade } from 'requests/queries/grades';
import { useListGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';
import { useSessionSchoolYear } from 'requests/queries/session';

import * as S from './styles';
import { useAccess } from 'hooks/AccessProvider';

type SelectedItems = {
  id?: string;
  school_subject?: string;
  teacher?: string;
  day_of_week: DayOfWeek;
  time_start: string;
  time_end: string;
};

type TimetableTeacherSchoolSubjectSelectorProps = {
  classroom: Classroom;
  currentData?: Timetable;
  dayOfWeek: DayOfWeek;
  timeStart: string;
  timeEnd: string;
  onChange: (values: SelectedItems) => void;
};

type HandleChangeParams = {
  school_subject?: string;
  teacher?: string;
};

const TimetableTeacherSchoolSubjectSelector = ({
  classroom,
  currentData,
  dayOfWeek,
  timeStart,
  timeEnd,
  onChange
}: TimetableTeacherSchoolSubjectSelectorProps): JSX.Element => {
  const [selectedSchoolSubject, setSelectedSchoolSubject] = useState<string>();
  const [selectedTeacher, setSelectedTeacher] = useState<string>();

  const { enableAccess } = useAccess();

  const { data: schoolYear } = useSessionSchoolYear();

  const { data: grade } = useShowGrade(classroom.grade_id);
  const { data: gradeSchoolSubjects } = useListGradeSchoolSubjects(
    {
      grade_id: classroom.grade_id,
      is_multidisciplinary: !!grade?.is_multidisciplinary
    },
    { enabled: !!grade }
  );

  const { data: schoolTeachers } = useListSchoolTeachers({
    school_id: classroom?.school_id,
    school_year_id: schoolYear?.id
  });

  const {
    data: classroomTeacherSchoolSubjects,
    isLoading: loadingClassroomTeacherSchoolSubjects
  } = useListClassroomTeacherSchoolSubjects({
    classroom_id: classroom?.id,
    school_id: classroom?.school_id,
    school_subject_id: selectedSchoolSubject,
    is_multidisciplinary: 1
  });

  const handleValidate = useCallback(
    async (teacher?: string) => {
      if (teacher) {
        const toastKey = uuidv4();
        toast.info(
          <ToastContent showSpinner>
            Verificando disponibilidade...
          </ToastContent>,
          {
            id: toastKey,
            dismissible: false
          }
        );

        const response = await validateTimetable({
          classroom_id: classroom.id,
          school_id: classroom.school_id,
          employee_id: teacher,
          day_of_week: dayOfWeek,
          time_start: timeStart,
          time_end: timeEnd
        });

        toast.dismiss(toastKey);
        if (response.isValid) return true;

        const existent = response.existent!;
        const existentSchoolSubject =
          existent.school_subject?.description || 'Interdisciplinar';

        const message = `O professor(a) ${existent.employee?.name} já está alocado para a turma ${existent.classroom?.description} na disciplina ${existentSchoolSubject}. \n\n Deseja realoca-lo?`;
        return window.confirm(message);
      }

      return true;
    },
    [classroom, dayOfWeek, timeEnd, timeStart]
  );

  const handleChange = async (values: HandleChangeParams) => {
    const { school_subject, teacher } = values;

    if (!classroom.is_multidisciplinary) {
      if (!!teacher && !school_subject) return;
      if (!!school_subject && !teacher) return;
    } else if (!teacher) return;

    const keepGoing = await handleValidate(teacher);
    if (!keepGoing) {
      setSelectedSchoolSubject(currentData?.school_subject_id);
      setSelectedTeacher(currentData?.employee_id);
      return;
    }

    onChange({
      id: currentData?.id,
      school_subject: school_subject,
      teacher: teacher,
      day_of_week: dayOfWeek,
      time_start: timeStart,
      time_end: timeEnd
    });
  };

  const handleChangeSchoolSubject = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (classroom.is_multidisciplinary) return;

    const value = event.target.value;
    const selectedItem = value !== 'empty' ? value : undefined;

    setSelectedSchoolSubject(selectedItem);
    handleChange({
      teacher: selectedTeacher,
      school_subject: selectedItem
    });
  };

  const handleSelectTeacher = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const selectedItem = value !== 'empty' ? value : undefined;
    setSelectedTeacher(selectedItem);

    handleChange({
      teacher: selectedItem,
      school_subject: selectedSchoolSubject
    });
  };

  useEffect(() => {
    if (classroom.is_multidisciplinary) {
      setSelectedSchoolSubject(undefined);
    } else {
      setSelectedSchoolSubject(currentData?.school_subject_id);
    }

    setSelectedTeacher(currentData?.employee_id);
  }, [currentData, classroom]);

  const schoolTeachersOptions = useMemo(() => {
    if (loadingClassroomTeacherSchoolSubjects)
      return [{ label: 'Carregando...', value: '' }];

    if (classroomTeacherSchoolSubjects?.length) {
      return classroomTeacherSchoolSubjects?.map(({ employee }) => ({
        label: employee.name,
        value: employee.id
      }));
    }

    return schoolTeachers?.map((schoolTeacher) => ({
      label: schoolTeacher.employee.name,
      value: schoolTeacher.employee.id
    }));
  }, [
    classroomTeacherSchoolSubjects,
    loadingClassroomTeacherSchoolSubjects,
    schoolTeachers
  ]);

  const canChangeClassroomTeacher = useMemo(
    () => enableAccess({ module: 'CLASSROOM_TEACHER', rule: 'WRITE' }),
    [enableAccess]
  );

  const filteredGradeSchoolSubjects = gradeSchoolSubjects?.filter(
    ({ school_subject }) => !!school_subject
  );

  return (
    <S.Wrapper>
      {!classroom.is_multidisciplinary && (
        <S.InputContainer>
          <span>Disciplina:</span>
          <select
            onChange={handleChangeSchoolSubject}
            disabled={!canChangeClassroomTeacher}
          >
            <option value="empty" selected={!selectedSchoolSubject}>
              &nbsp;
            </option>

            {filteredGradeSchoolSubjects?.map(({ school_subject }) => (
              <option
                key={school_subject?.id}
                value={school_subject?.id}
                selected={selectedSchoolSubject === school_subject?.id}
              >
                {school_subject?.description}
              </option>
            ))}
          </select>
        </S.InputContainer>
      )}

      <S.InputContainer>
        <span>Professor:</span>
        <select
          onChange={handleSelectTeacher}
          disabled={!canChangeClassroomTeacher}
        >
          <option value="empty" selected={!selectedTeacher}>
            &nbsp;
          </option>

          {schoolTeachersOptions?.map(({ label, value }, index) => (
            <option
              key={`${value}-${index}`}
              value={value}
              selected={selectedTeacher === value}
            >
              {label}
            </option>
          ))}
        </select>
      </S.InputContainer>
    </S.Wrapper>
  );
};

export default TimetableTeacherSchoolSubjectSelector;
