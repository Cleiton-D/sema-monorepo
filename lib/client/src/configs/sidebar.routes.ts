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
    path: '/auth/calendar',
    name: 'Calendário Escolar'
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
  },
  {
    path: '/auth/class-reports',
    name: 'Relatório de aulas'
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
  },
  {
    path: '/auth/school-reports/by-classroom',
    name: 'Notas'
  },
  {
    path: '/auth/class-reports',
    name: 'Relatório de aulas'
  },
  {
    path: '/auth/reports/total-attendances',
    name: 'Total geral de faltas'
  },
  {
    path: '/auth/calendar',
    name: 'Calendário Escolar'
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
    path: '/auth/system/backgrounds',
    name: 'Planos de fundo'
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
    path: '/auth/calendar',
    name: 'Calendário Escolar'
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
  },
  {
    path: '/auth/class-reports',
    name: 'Relatório de aulas'
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
  },
  {
    path: '/auth/reports/ata',
    name: 'Ata'
  },
  {
    path: '/auth/class-reports',
    name: 'Relatório de aulas'
  },
  {
    path: '/auth/final-reports',
    name: 'Relatório Final'
  },
  {
    path: '/auth/reports/total-attendances',
    name: 'Total geral de faltas'
  },
  {
    path: '/auth/calendar',
    name: 'Calendário Escolar'
  }
];

export { administrator, municipalSecretary, teacher };
