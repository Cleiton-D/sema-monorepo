const municipalSecretary = [
  {
    path: '/administration/school-year',
    name: 'Ano Letivo'
  },
  {
    path: '/administration/employees',
    name: 'Servidores'
  },
  {
    path: '/administration/schools',
    name: 'Escolas'
  },
  {
    path: '/administration/school-teachers',
    name: 'Lotação de professores'
  },
  {
    path: '/class-periods',
    name: 'Períodos e Horários'
  },
  {
    path: '/administration/grades',
    name: 'Séries'
  },
  {
    path: '/administration/school-subjects',
    name: 'Disciplinas'
  },
  {
    path: '/enrolls',
    name: 'Alunos ativos'
  }
];

const teacher = [
  {
    path: '/administration/school-year',
    name: 'Ano Letivo'
  },
  {
    path: '/classes',
    name: 'Aulas registradas'
  }
];

const administrator = [
  {
    path: '/administration/municipal-secretary',
    name: 'Secretaria Municipal'
  },
  {
    path: '/administration/access-levels',
    name: 'Níveis de acesso'
  },
  {
    path: '/users',
    name: 'Usuários'
  },
  {
    path: '/administration/employees',
    name: 'Servidores'
  },
  {
    path: '/administration/school-year',
    name: 'Ano Letivo'
  },
  {
    path: '/administration/schools',
    name: 'Escolas'
  },
  {
    path: '/administration/grades',
    name: 'Séries'
  },
  {
    path: '/administration/school-subjects',
    name: 'Disciplinas'
  }
];

export const schoolAdministration = [
  {
    path: '/administration/school-year',
    name: 'Ano Letivo'
  },
  {
    path: '/enrolls?school_id=me',
    name: 'Alunos ativos'
  },
  {
    path: '/school/me/classrooms',
    name: 'Turmas'
  },
  {
    path: '/school/me/teacher-school-subjects',
    name: 'Professores'
  },
  {
    path: '/school/me/classroom-teacher',
    name: 'Turmas x Professores'
  }
];

export { administrator, municipalSecretary, teacher };
