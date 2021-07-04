import * as Yup from 'yup';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const classPeriodSchema = Yup.object({
  description: Yup.string().required('Campo obrigatório.'),
  class_time: Yup.string()
    .required('Campo obrigatório.')
    .matches(timeRegex, 'Insira um horário válido'),
  time_start: Yup.string()
    .required('Campo obrigatório.')
    .matches(timeRegex, 'Insira um horário válido'),
  time_end: Yup.string()
    .required('Campo obrigatório.')
    .matches(timeRegex, 'Insira um horário válido'),
  break_time: Yup.string()
    .required('Campo obrigatório.')
    .matches(timeRegex, 'Insira um horário válido'),
  break_time_start: Yup.string()
    .required('Campo obrigatório.')
    .matches(timeRegex, 'Insira um horário válido')
});
