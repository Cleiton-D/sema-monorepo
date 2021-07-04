import { useEffect, useState } from 'react';

import { TeacherSchoolSubject } from 'models/TeacherSchoolSubject';
import { Employee } from 'models/Employee';

import * as S from './styles';

type ClassroomTableTeacherSelectorProps = {
  teacherSchoolSubjects?: TeacherSchoolSubject[];
  selectedEmployee?: string;
  onChange?: (employee?: Employee) => void;
};

const ClassroomTableTeacherSelector = ({
  teacherSchoolSubjects = [],
  selectedEmployee,
  onChange = () => null
}: ClassroomTableTeacherSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedTeacherSchoolSubject = teacherSchoolSubjects.find(
      ({ employee_id }) => employee_id === value
    );
    onChange(selectedTeacherSchoolSubject?.employee);
  };

  useEffect(() => {
    setSelectedOption(selectedEmployee);
  }, [selectedEmployee]);

  return (
    <S.Wrapper value={selectedOption} onChange={handleChange}>
      <option>&nbsp;</option>
      {teacherSchoolSubjects?.map(({ employee }) => (
        <option key={employee.id} value={employee.id}>
          {employee.person.name}
        </option>
      ))}
    </S.Wrapper>
  );
};

export default ClassroomTableTeacherSelector;
