import { useMemo } from 'react';
import { useSession } from 'next-auth/client';
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

import { useListSchoolsSubjects } from 'requests/queries/school-subjects';
import { useListTeacherSchoolSubjects } from 'requests/queries/teacher-school-subjects';
import { useListClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';
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
  school_subject: SchoolSubject;
  classroom_teacher_school_subject?: ClassroomTeacherSchoolSubject;
};

const ClassroomTeachersTable = ({ classroom }: ClassroomTeachersTableProps) => {
  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data: schoolSubjects } = useListSchoolsSubjects(session, {
    grade_id: classroom.grade_id
  });

  const {
    data: classroomTeacherSchoolSubjects,
    refetch
  } = useListClassroomTeacherSchoolSubjects(session, {
    classroom_id: classroom.id,
    school_id: classroom.school_id
  });

  const teacherSchoolSubjectsFilters = useMemo(() => {
    if (!schoolSubjects) return {};

    return {
      school_id: classroom?.school_id,
      school_subject_id: schoolSubjects.map(({ id }) => id)
    };
  }, [schoolSubjects, classroom]);

  const { data: teacherSchoolSubjects } = useListTeacherSchoolSubjects(
    session,
    teacherSchoolSubjectsFilters
  );

  const deleteClassroomTeacherSchoolSubject = useDeleteClassroomTeacherSchoolSubject();
  const linkClassroomTeacherSchoolSubjects = useLinkClassroomTeacherSchoolSubject();

  const tableData = useMemo(() => {
    if (!schoolSubjects) return [];

    return schoolSubjects.map((schoolSubject) => {
      const classroomTeacherSchoolSubject = classroomTeacherSchoolSubjects?.find(
        (item) => item.school_subject_id === schoolSubject.id
      );

      return {
        key: uuidv4(),
        school_subject: schoolSubject,
        classroom_teacher_school_subject: classroomTeacherSchoolSubject
      };
    });
  }, [schoolSubjects, classroomTeacherSchoolSubjects]);

  const handleRemoveTeacher = async (item: ClassroomTeachersTableData) => {
    const personName =
      item.classroom_teacher_school_subject?.employee.person.name;

    const confirm = window.confirm(
      `Deseja remover o professor ${personName} da disciplina ${item.school_subject.description}?`
    );
    if (confirm) {
      await deleteClassroomTeacherSchoolSubject.mutateAsync({
        classroom,
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
            school_subject_id: item.school_subject.id,
            employee_id: newEmployee.id
          }
        ]
      };
      await linkClassroomTeacherSchoolSubjects.mutateAsync(requestData);
      refetch();
    };

    if (item.classroom_teacher_school_subject) {
      const confirm = window.confirm(
        `Deseja substituir o professor ${item.classroom_teacher_school_subject?.employee.person.name} pelo professor ${newEmployee.person.name}?`
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
      <TableColumn label="Disciplina" tableKey="school_subject.description" />
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
              teacherSchoolSubjects={teacherSchoolSubjects?.filter(
                ({ school_subject_id }) =>
                  school_subject_id === item.school_subject.id
              )}
            />
          ) : (
            item.classroom_teacher_school_subject?.employee.person.name
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
