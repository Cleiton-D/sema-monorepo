import * as Yup from 'yup';

export const getGradeSchoolSubjectSchema = (is_multidisciplinary: boolean) => {
  return Yup.object({
    school_subject_id: Yup.string().required('Campo obrigatório.'),

    ...(!is_multidisciplinary
      ? { workload: Yup.string().required('Campo obrigatório.') }
      : {})
  });
};
