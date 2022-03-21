import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Form } from '@unform/web';
import { useUpdateAtom, RESET } from 'jotai/utils';

import Checkbox from 'components/Checkbox';
import AutocompleteField from 'components/AutocompleteInput';

import { Student } from 'models/Student';
import { CompleteEnrollFormData } from 'models/Enroll';

import { listStudents, getStudent } from 'requests/queries/students';

import { createEnrollData, selectedStudent } from 'store/atoms/create-enroll';

import * as S from './styles';

const OldStudentForm = () => {
  const [oldStudent, setOldStudent] = useState(false);

  const setStudentData = useUpdateAtom(createEnrollData);
  const setSelectedStudent = useUpdateAtom(selectedStudent);

  const { data: session } = useSession();

  const handleOldStudent = (value: boolean) => {
    setOldStudent(value);

    if (!value) {
      setStudentData(RESET);
      setSelectedStudent(RESET);
    }
  };

  const studentLabelFormatter = useCallback((item: Student) => {
    let value = item.name;
    if (item.cpf) {
      value = `${value}, CPF: ${item.cpf}`;
    }
    if (item.rg) {
      value = `${value}, RG: ${item.cpf}`;
    }

    return value;
  }, []);

  const handleSelectedStudent = useCallback(
    async (studentId?: string) => {
      if (!studentId) {
        setStudentData(RESET);
        setSelectedStudent(RESET);
        return;
      }

      const student = await getStudent(session, studentId);

      const { contacts = [], birth_date, ...newStudent } = student;

      const contactsData = contacts.filter((contact) => !!contact);

      const dateStr =
        birth_date instanceof Date
          ? birth_date.toISOString()
          : String(birth_date);

      const [year, month, day] = dateStr.split('T')[0].split('-');
      const newBirthDate = `${day}/${month}/${year}`;

      const studentData = {
        ...newStudent,
        birth_date: newBirthDate,
        contacts: contactsData
      };
      setStudentData({
        student: studentData,
        unique_code: studentData.unique_code
      } as unknown as CompleteEnrollFormData);

      setSelectedStudent(student);
    },
    [session, setStudentData, setSelectedStudent]
  );

  return (
    <Form onSubmit={() => null}>
      <S.Wrapper>
        <S.CheckBoxContainer>
          <Checkbox
            label="Ex-aluno"
            labelFor="old-student"
            isChecked={oldStudent}
            onCheck={handleOldStudent}
          />
        </S.CheckBoxContainer>
        {oldStudent && (
          <S.AutoCompleteContainer>
            <AutocompleteField
              label="Pesquisar aluno"
              name="name"
              queryFn={(filters) => listStudents(session, filters)}
              labelPath="name"
              searchBy={['name', 'cpf', 'rg']}
              valuePath="id"
              onChangeOption={handleSelectedStudent}
              placeholder="Pesquise por nome, CPF ou RG"
              formatter={studentLabelFormatter}
              emptyOption
            />
          </S.AutoCompleteContainer>
        )}
      </S.Wrapper>
    </Form>
  );
};

export default OldStudentForm;
