import format from 'date-fns/format';
import { SchoolTerm } from 'models/SchoolTerm';
import {
  FormattedSchoolTermPeriod,
  SchoolTermPeriod,
  SchoolTermPeriodsObject,
  TermPeriodStatus
} from 'models/SchoolTermPeriod';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

const status: Record<TermPeriodStatus, string> = {
  ACTIVE: 'Ativo',
  FINISH: 'Encerrado',
  PENDING: 'Pendente'
};

const descriptions: Record<SchoolTerm, string> = {
  FIRST: 'Primeiro Bimestre',
  SECOND: 'Segundo Bimestre',
  THIRD: 'Terceiro Bimestre',
  FOURTH: 'Quarto Bimestre',
  'FIRST-REC': 'Recuperação 1º semestre',
  'SECOND-REC': 'Recuperação 2º semestre',
  EXAM: 'Exame'
};

export const schoolTermPeriodMapper = (
  schoolTermPeriod: SchoolTermPeriod
): FormattedSchoolTermPeriod => ({
  ...schoolTermPeriod,
  translatedDescription: descriptions[schoolTermPeriod.school_term],
  translatedStatus: status[schoolTermPeriod.status],
  formattedDateStart: format(
    parseDateWithoutTimezone(schoolTermPeriod.date_start),
    'dd/MM/yyyy'
  ),
  formattedDateEnd: format(
    parseDateWithoutTimezone(schoolTermPeriod.date_end),
    'dd/MM/yyyy'
  )
});

export const mapSchoolTermPeriodsToObject = (
  schoolTermPeriods: SchoolTermPeriod[]
): SchoolTermPeriodsObject =>
  schoolTermPeriods.reduce<SchoolTermPeriodsObject>((acc, item) => {
    const { school_term } = item;
    return { ...acc, [school_term]: schoolTermPeriodMapper(item) };
  }, {});

const order: Record<SchoolTerm, number> = {
  FIRST: 0,
  SECOND: 1,
  'FIRST-REC': 2,
  THIRD: 3,
  FOURTH: 4,
  'SECOND-REC': 5,
  EXAM: 6
};

export const orderSchoolTerm = (a: SchoolTerm, b: SchoolTerm) => {
  const indexA = order[a];
  const indexB = order[b];

  return indexA - indexB;
};

const shortDescriptions: Record<SchoolTerm, string> = {
  FIRST: '1º Bimestre',
  SECOND: '2º Bimestre',
  THIRD: '3º Bimestre',
  FOURTH: '4º Bimestre',
  'FIRST-REC': 'Rec. 1º Semestre',
  'SECOND-REC': 'Rec. 2º Semestre',
  EXAM: 'Exame'
};
export const shortTranslateSchoolTerm = (schoolTerm: SchoolTerm) => {
  return shortDescriptions[schoolTerm];
};
