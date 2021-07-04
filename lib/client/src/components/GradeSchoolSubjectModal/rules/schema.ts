import * as Yup from 'yup';

export const gradeSchoolSubjectSchema = Yup.object({
  school_subject_id: Yup.string().required('Campo obrigatório.'),
  workload: Yup.string().required('Campo obrigatório.')
});
