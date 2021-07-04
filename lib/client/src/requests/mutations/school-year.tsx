import { useCallback } from 'react';
import { useSession } from 'next-auth/client';

import ToastContent from 'components/ToastContent';

import { initializeApi, useMutation } from 'services/api';

import { SchoolTerm } from 'models/SchoolTerm';
import { SchoolYear } from 'models/SchoolYear';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

type DatesParam = {
  date_start: Date;
  date_end: Date;
};

type CreateSchoolYearParams = {
  school_terms: Record<SchoolTerm, DatesParam>;

  school_year_id?: string;
  school_year: DatesParam & {
    reference_year: string;
  };
};

export function useCreateSchoolYearMudation() {
  const [session] = useSession();

  const createSchoolYear = useCallback(
    async (values: CreateSchoolYearParams) => {
      const api = initializeApi(session);

      const schoolYearParams = values.school_year;
      const schoolTermParams = Object.entries(values.school_terms).map(
        ([key, value]) => ({
          school_term: key,
          date_start: value.date_start,
          date_end: value.date_end
        })
      );

      const { data: schoolYear } = values.school_year_id
        ? await api.put<SchoolYear>(
            `/education/admin/school-years/${values.school_year_id}`,
            schoolYearParams
          )
        : await api.post<SchoolYear>(
            '/education/admin/school-years',
            schoolYearParams
          );

      const { data: schoolTermPeriods } = await api.post<SchoolTermPeriod[]>(
        `/education/admin/school-term-periods`,
        {
          school_year_id: schoolYear.id,
          term_periods: schoolTermParams
        }
      );

      return {
        schoolYear,
        schoolTermPeriods
      };
    },
    [session]
  );

  return useMutation('create-school-year', createSchoolYear, {
    linkedQueries: {
      'show-school-year': (old) => old
    },
    renderLoading: function render(newSchoolYear: CreateSchoolYearParams) {
      return (
        <ToastContent showSpinner>
          Salvando ano letivo de {newSchoolYear.school_year.reference_year}...
        </ToastContent>
      );
    },
    renderError: () => `Falha ao cadastrar ano letivo`,
    renderSuccess: () => `Ano letivo cadastrado com sucesso!`
  });
}
