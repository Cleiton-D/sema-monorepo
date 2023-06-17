import { useMemo } from 'react';
import { X } from '@styled-icons/feather';
import { v4 as uuidv4 } from 'uuid';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import ClassroomTableTeacherSelector from 'components/ClassroomTableTeacherSelector';

import { useAccess } from 'hooks/AccessProvider';

import { SchoolSubject } from 'models/SchoolSubject';
import { Classroom } from 'models/Classroom';
import { Employee } from 'models/Employee';
import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';

import { useListClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';
import { useListSchoolTeachers } from 'requests/queries/school-teachers';
import { useShowGrade } from 'requests/queries/grades';
import { useListGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';
import { useSessionSchoolYear } from 'requests/queries/session';
import {
  useDeleteClassroomTeacherSchoolSubject,
  useLinkClassroomTeacherSchoolSubject
} from 'requests/mutations/classroom-teacher-school-subjects';

import * as S from './styles';

type ClassroomTeachersTableProps = {
  classroom: Classroom;
};

type ClassroomTeachersTableData = {
  key: string;
  school_subject_description: string;
  school_subject?: SchoolSubject;
  classroom_teacher_school_subject?: ClassroomTeacherSchoolSubject;
};

const ClassroomTeachersTable = ({ classroom }: ClassroomTeachersTableProps) => {
  const { enableAccess } = useAccess();

  const { data: schoolYear } = useSessionSchoolYear();

  const { data: grade } = useShowGrade(classroom.grade_id);
  const { data: gradeSchoolSubjects } = useListGradeSchoolSubjects(
    {
      grade_id: classroom.grade_id,
      is_multidisciplinary: grade?.is_multidisciplinary
    },
    { enabled: !!grade }
  );

  const { data: classroomTeacherSchoolSubjects, refetch } =
    useListClassroomTeacherSchoolSubjects({
      classroom_id: classroom.id,
      is_multidisciplinary: null
    });

  const { data: schoolTeachers } = useListSchoolTeachers({
    school_id: classroom?.school_id,
    school_year_id: schoolYear?.id
  });

  const deleteClassroomTeacherSchoolSubject =
    useDeleteClassroomTeacherSchoolSubject();
  const linkClassroomTeacherSchoolSubjects =
    useLinkClassroomTeacherSchoolSubject();

  const tableData = useMemo(() => {
    if (!gradeSchoolSubjects) return [];

    return gradeSchoolSubjects.map(({ school_subject }) => {
      const classroomTeacherSchoolSubject =
        classroomTeacherSchoolSubjects?.find(
          (item) => item.school_subject_id === school_subject?.id
        );

      return {
        key: uuidv4(),
        school_subject_description: school_subject?.description || '',
        school_subject: school_subject,
        classroom_teacher_school_subject: classroomTeacherSchoolSubject
      };
    });
  }, [gradeSchoolSubjects, classroomTeacherSchoolSubjects]);

  const handleRemoveTeacher = async (item: ClassroomTeachersTableData) => {
    const personName = item.classroom_teacher_school_subject?.employee.name;

    const confirm = window.confirm(
      `Deseja remover o professor ${personName} da disciplina ${item.school_subject_description}?`
    );
    if (confirm) {
      await deleteClassroomTeacherSchoolSubject.mutateAsync({
        classroomTeacherSchoolSubject: item.classroom_teacher_school_subject
      });
      refetch();
    }
  };

  const handleChangeTeacher = async (
    item: ClassroomTeachersTableData,
    newEmployee?: Employee
  ) => {
    if (!newEmployee) return handleRemoveTeacher(item);

    const sendRequest = async () => {
      const requestData = {
        classroom,
        teacher_school_subjects: [
          {
            school_subject_id: item.school_subject?.id,
            employee_id: newEmployee.id,
            is_multidisciplinary: !!classroom.is_multidisciplinary
          }
        ]
      };
      await linkClassroomTeacherSchoolSubjects.mutateAsync(requestData);
      refetch();
    };

    if (item.classroom_teacher_school_subject) {
      const confirm = window.confirm(
        `Deseja substituir o professor ${item.classroom_teacher_school_subject?.employee.name} pelo professor ${newEmployee.name}?`
      );

      return confirm && sendRequest();
    }

    sendRequest();
  };

  const canChangeClassroomTeacher = useMemo(
    () => enableAccess({ module: 'CLASSROOM_TEACHER', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Table<ClassroomTeachersTableData>
      items={tableData}
      keyExtractor={(value) => value.key}
      minimal
    >
      <TableColumn label="Disciplina" tableKey="school_subject_description" />
      <TableColumn
        label="Professor"
        tableKey=""
        actionColumn
        render={(item: ClassroomTeachersTableData) =>
          canChangeClassroomTeacher ? (
            <ClassroomTableTeacherSelector
              onChange={(newEmployee) => handleChangeTeacher(item, newEmployee)}
              selectedEmployee={
                item.classroom_teacher_school_subject?.employee_id
              }
              schoolTeachers={schoolTeachers}
            />
          ) : (
            item.classroom_teacher_school_subject?.employee.name
          )
        }
      />
      <TableColumn
        label="Ações"
        tableKey=""
        contentAlign="center"
        actionColumn
        module="CLASSROOM_TEACHER"
        rule="WRITE"
        render={(item: ClassroomTeachersTableData) =>
          item.classroom_teacher_school_subject && (
            <S.ActionButton
              title="Remover vinculo"
              onClick={() => handleRemoveTeacher(item)}
            >
              <X size={16} title="Remover vinculo" />
            </S.ActionButton>
          )
        }
      />
    </Table>
  );
};

export default ClassroomTeachersTable;
