const municipalSecretary = [
  {
    path: '/auth/administration/school-year',
    name: 'Ano Letivo'
  },
  {
    path: '/auth/administration/employees',
    name: 'Servidores'
  },
  {
    path: '/auth/administration/schools',
    name: 'Escolas'
  },
  {
    path: '/auth/administration/school-teachers',
    name: 'Lotação de professores'
  },
  {
    path: '/auth/administration/grades',
    name: 'Séries'
  },
  {
    path: '/auth/administration/school-subjects',
    name: 'Disciplinas'
  },
  {
    path: '/auth/class-periods',
    name: 'Períodos e Horários'
  },
  {
    path: '/auth/enrolls',
    name: 'Matrículas'
  },
  {
    path: '/auth/reports/ata',
    name: 'Ata'
  },
  {
    path: '/auth/reports/registers-book',
    name: 'Livro de registros'
  },
  {
    path: '/auth/reports/school-report-board',
    name: 'Quadro de notas'
  },
  {
    path: '/auth/reports/total-attendances',
    name: 'Total geral de faltas'
  }
];

const teacher = [
  {
    path: '/auth/administration/school-year',
    name: 'Ano Letivo'
  },
  {
    path: '/auth/classes',
    name: 'Aulas registradas'
  }
];

const administrator = [
  {
    path: '/auth/administration/municipal-secretary',
    name: 'Secretaria Municipal'
  },
  {
    path: '/auth/administration/access-levels',
    name: 'Níveis de acesso'
  },
  {
    path: '/auth/users',
    name: 'Usuários'
  },
  {
    path: '/auth/administration/employees',
    name: 'Servidores'
  },
  {
    path: '/auth/administration/school-year',
    name: 'Ano Letivo'
  },
  {
    path: '/auth/administration/schools',
    name: 'Escolas'
  },
  {
    path: '/auth/administration/grades',
    name: 'Séries'
  },
  {
    path: '/auth/administration/school-subjects',
    name: 'Disciplinas'
  },
  {
    path: '/auth/class-periods',
    name: 'Períodos e Horários'
  },
  {
    path: '/auth/reports/ata',
    name: 'Ata'
  },
  {
    path: '/auth/reports/registers-book',
    name: 'Livro de registros'
  },
  {
    path: '/auth/reports/school-report-board',
    name: 'Quadro de notas'
  },
  {
    path: '/auth/reports/total-attendances',
    name: 'Total geral de faltas'
  }
];

export const schoolAdministration = [
  {
    path: '/auth/administration/school-year',
    name: 'Ano Letivo'
  },
  {
    path: '/auth/enrolls?school_id=me',
    name: 'Matrículas'
  },
  {
    path: '/auth/school/me/classrooms',
    name: 'Turmas'
  },
  // {
  //   path: '/auth/school/me/teacher-school-subjects',
  //   name: 'Professores'
  // },
  {
    path: '/auth/school/me/classroom-teacher',
    name: 'Turmas x Professores'
  },
  {
    path: '/auth/school/me/timetables',
    name: 'Horários'
  }
];

export { administrator, municipalSecretary, teacher };
