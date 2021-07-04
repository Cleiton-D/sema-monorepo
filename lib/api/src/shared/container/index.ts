import { container } from 'tsyringe';

import IContactsRepository from '@modules/contacts/repositories/IContactsRepository';
import ContactsRepository from '@modules/contacts/infra/typeorm/repositories/ContactsRepository';

import IAdressesRepository from '@modules/address/repositories/IAdressesRepository';
import AdressesRepository from '@modules/address/infra/typeorm/repositories/AdressesRepository';

import IPersonsRepository from '@modules/persons/repositories/IPersonsRepository';
import PersonsRepository from '@modules/persons/infra/typeorm/repositories/PersonsRepository';

import IPersonDocumentsRepository from '@modules/persons/repositories/IPersonDocumentsRepository';
import PersonDocumentsRepository from '@modules/persons/infra/typeorm/repositories/PersonDocumentsRepository';

import IPersonContactsRepository from '@modules/persons/repositories/IPersonContactsRepository';
import PersonContactsRepository from '@modules/persons/infra/typeorm/repositories/PersonContactsRepository';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import IAppModulesRepository from '@modules/authorization/repositories/IAppModulesRepository';
import AppModulesRepository from '@modules/authorization/infra/typeorm/repositories/AppModulesRepository';

import IAccessLevelsRepository from '@modules/authorization/repositories/IAccessLevelsRepository';
import AccessLevelsRepository from '@modules/authorization/infra/typeorm/repositories/AccessLevelsRepository';

import IAccessModulesRepository from '@modules/authorization/repositories/IAccessModulesRepository';
import AccessModulesRepository from '@modules/authorization/infra/typeorm/repositories/AccessModulesRepository';

import IUserProfilesRepository from '@modules/users/repositories/IUserProfilesRepository';
import UserProfilesRepository from '@modules/users/infra/typeorm/repositories/UserProfilesRepository';

import IBranchRepository from '@modules/authorization/repositories/IBranchRepository';
import BranchRepository from '@modules/authorization/infra/typeorm/repositories/BranchRepository';

import ISchoolsRepository from '@modules/schools/repositories/ISchoolsRepository';
import SchoolsRepository from '@modules/schools/infra/typeorm/repositories/SchoolsRepository';

import IStudentsRepository from '@modules/students/repositories/IStudentsRepository';
import StudentsRepository from '@modules/students/infra/typeorm/repositories/StudentsRepository';

import ISchoolYearsRepository from '@modules/education_core/repositories/ISchoolYearsRepository';
import SchoolYearsRepository from '@modules/education_core/infra/typeorm/repositories/SchoolYearsRepository';

import IGradesRepository from '@modules/education_core/repositories/IGradesRepository';
import GradesRepository from '@modules/education_core/infra/typeorm/repositories/GradesRepository';

import ITeachersRepository from '@modules/teachers/repositories/ITeachersRepository';
import TeachersRepository from '@modules/teachers/infra/typeorm/repositories/TeachersRepository';

import IClassroomsRepository from '@modules/schools/repositories/IClassroomsRepository';
import ClassroomsRepository from '@modules/schools/infra/typeorm/repositories/ClassroomsRepository';

import IClassPeriodsRepository from '@modules/education_core/repositories/IClassPeriodsRepository';
import ClassPeriodsRepository from '@modules/education_core/infra/typeorm/repositories/ClassPeriodsRepository';

import ISchoolClassPeriodsRepository from '@modules/schools/repositories/ISchoolClassPeriodsRepository';
import SchoolClassPeriodsRepository from '@modules/schools/infra/typeorm/repositories/SchoolClassPeriodsRepository';

import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';
import GradeSchoolSubjectsRepository from '@modules/education_core/infra/typeorm/repositories/GradeSchoolSubjectsRepository';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import SchoolSubjectsRepository from '@modules/education_core/infra/typeorm/repositories/SchoolSubjectsRepository';

import ITeacherSchoolSubjectsRepository from '@modules/schools/repositories/ITeacherSchoolSubjectsRepository';
import TeacherSchoolSubjectsRepository from '@modules/schools/infra/typeorm/repositories/TeacherSchoolSubjectsRepository';

import IClassroomTeacherSchoolSubjectsRepository from '@modules/schools/repositories/IClassroomTeacherSchoolSubjectsRepository';
import ClassroomTeacherSchoolSubjectsRepository from '@modules/schools/infra/typeorm/repositories/ClassroomTeacherSchoolSubjectsRepository';

import ISchoolTeachersRepository from '@modules/schools/repositories/ISchoolTeachersRepository';
import SchoolTeachersRepository from '@modules/schools/infra/typeorm/repositories/SchoolTeachersRepository';

import IEnrollsRepository from '@modules/enrolls/repositories/IEnrollsRepository';
import EnrollsRepository from '@modules/enrolls/infra/typeorm/repositories/EnrollsRepository';

import ISchoolReportsRepository from '@modules/enrolls/repositories/ISchoolReportsRepository';
import SchoolReportsRepository from '@modules/enrolls/infra/typeorm/repositories/SchoolReportsRepository';

import ISchoolTermPeriodsRepository from '@modules/education_core/repositories/ISchoolTermPeriodsRepository';
import SchoolTermPeriodsRepository from '@modules/education_core/infra/typeorm/repositories/SchoolTermPeriodsRepository';

import IClassesRepository from '@modules/classes/repositories/IClassesRepository';
import ClassesRepository from '@modules/classes/infra/typeorm/repositories/ClassesRepository';

import IAttendancesRepository from '@modules/classes/repositories/IAttendancesRepository';
import AttendancesRepository from '@modules/classes/infra/typeorm/repositories/AttendancesRepository';

import IEnrollClassroomsRepository from '@modules/enrolls/repositories/IEnrollClassroomsRepository';
import EnrollClassroomsRepository from '@modules/enrolls/infra/typeorm/repositories/EnrollClassroomsRepository';

import ISchoolContactsRepository from '@modules/schools/repositories/ISchoolContactsRepository';
import SchoolContactsRepository from '@modules/schools/infra/typeorm/repositories/SchoolContactsRepository';

container.registerSingleton<IContactsRepository>(
  'ContactsRepository',
  ContactsRepository,
);

container.registerSingleton<IAdressesRepository>(
  'AdressesRepository',
  AdressesRepository,
);

container.registerSingleton<IPersonsRepository>(
  'PersonsRepository',
  PersonsRepository,
);

container.registerSingleton<IPersonDocumentsRepository>(
  'PersonDocumentsRepository',
  PersonDocumentsRepository,
);

container.registerSingleton<IPersonContactsRepository>(
  'PersonContactsRepository',
  PersonContactsRepository,
);

container.registerSingleton<IEmployeesRepository>(
  'EmployeesRepository',
  EmployeesRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IAppModulesRepository>(
  'AppModulesRepository',
  AppModulesRepository,
);

container.registerSingleton<IAccessLevelsRepository>(
  'AccessLevelsRepository',
  AccessLevelsRepository,
);

container.registerSingleton<IAccessModulesRepository>(
  'AccessModulesRepository',
  AccessModulesRepository,
);

container.registerSingleton<IUserProfilesRepository>(
  'UserProfilesRepository',
  UserProfilesRepository,
);

container.registerSingleton<IBranchRepository>(
  'BranchRepository',
  BranchRepository,
);

container.registerSingleton<IAccessLevelsRepository>(
  'AccessLevelsRepository',
  AccessLevelsRepository,
);

container.registerSingleton<ISchoolsRepository>(
  'SchoolsRepository',
  SchoolsRepository,
);

container.registerSingleton<IStudentsRepository>(
  'StudentsRepository',
  StudentsRepository,
);

container.registerSingleton<ISchoolYearsRepository>(
  'SchoolYearsRepository',
  SchoolYearsRepository,
);

container.registerSingleton<IGradesRepository>(
  'GradesRepository',
  GradesRepository,
);

container.registerSingleton<ITeachersRepository>(
  'TeachersRepository',
  TeachersRepository,
);

container.registerSingleton<IClassroomsRepository>(
  'ClassroomsRepository',
  ClassroomsRepository,
);

container.registerSingleton<IClassPeriodsRepository>(
  'ClassPeriodsRepository',
  ClassPeriodsRepository,
);

container.registerSingleton<ISchoolClassPeriodsRepository>(
  'SchoolClassPeriodsRepository',
  SchoolClassPeriodsRepository,
);

container.registerSingleton<IGradeSchoolSubjectsRepository>(
  'GradeSchoolSubjectsRepository',
  GradeSchoolSubjectsRepository,
);

container.registerSingleton<ISchoolSubjectsRepository>(
  'SchoolSubjectsRepository',
  SchoolSubjectsRepository,
);

container.registerSingleton<ITeacherSchoolSubjectsRepository>(
  'TeacherSchoolSubjectsRepository',
  TeacherSchoolSubjectsRepository,
);

container.registerSingleton<IClassroomTeacherSchoolSubjectsRepository>(
  'ClassroomTeacherSchoolSubjectsRepository',
  ClassroomTeacherSchoolSubjectsRepository,
);

container.registerSingleton<ISchoolTeachersRepository>(
  'SchoolTeachersRepository',
  SchoolTeachersRepository,
);

container.registerSingleton<IEnrollsRepository>(
  'EnrollsRepository',
  EnrollsRepository,
);

container.registerSingleton<ISchoolReportsRepository>(
  'SchoolReportsRepository',
  SchoolReportsRepository,
);

container.registerSingleton<ISchoolTermPeriodsRepository>(
  'SchoolTermPeriodsRepository',
  SchoolTermPeriodsRepository,
);

container.registerSingleton<IClassesRepository>(
  'ClassesRepository',
  ClassesRepository,
);

container.registerSingleton<IAttendancesRepository>(
  'AttendancesRepository',
  AttendancesRepository,
);

container.registerSingleton<IEnrollClassroomsRepository>(
  'EnrollClassroomsRepository',
  EnrollClassroomsRepository,
);

container.registerSingleton<ISchoolContactsRepository>(
  'SchoolContactsRepository',
  SchoolContactsRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
