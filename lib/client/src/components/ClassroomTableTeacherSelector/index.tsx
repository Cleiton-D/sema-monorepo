import { useEffect, useState } from 'react';

import { SchoolTeacher } from 'models/SchoolTeacher';
import { Employee } from 'models/Employee';

import * as S from './styles';

type ClassroomTableTeacherSelectorProps = {
  schoolTeachers?: SchoolTeacher[];
  selectedEmployee?: string;
  onChange?: (employee?: Employee) => void;
};

const ClassroomTableTeacherSelector = ({
  schoolTeachers = [],
  selectedEmployee,
  onChange = () => null
}: ClassroomTableTeacherSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedTeacherSchoolSubject = schoolTeachers.find(
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
      {schoolTeachers?.map(({ employee }) => (
        <option key={employee.id} value={employee.id}>
          {employee.name}
        </option>
      ))}
    </S.Wrapper>
  );
};

export default ClassroomTableTeacherSelector;
