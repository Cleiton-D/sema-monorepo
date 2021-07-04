import * as Yup from 'yup';

const schoolTermSchema = Yup.object({
  date_start: Yup.date().required('Campo obrigatório.'),
  date_end: Yup.date().required('Campo obrigatório.')
});

export const schoolYearBasicSchema = Yup.object({
  school_year: Yup.object({
    reference_year: Yup.string().required('Campo obrigatório.'),
    date_start: Yup.date().required('Campo obrigatório.'),
    date_end: Yup.date().required('Campo obrigatório.')
  }),
  school_terms: Yup.object({
    FIRST: schoolTermSchema,
    SECOND: schoolTermSchema,
    THIRD: schoolTermSchema,
    FOURTH: schoolTermSchema
  })
}).defined();
