import { injectable } from 'tsyringe';

import ListGradeService from './ListGradeService';
import SchoolYear from '../infra/typeorm/entities/SchoolYear';
import Grade from '../infra/typeorm/entities/Grade';
import CreateGradeService from './CreateGradeService';
import ListSchoolSubjectService from './ListSchoolSubjectService';
import SchoolSubject from '../infra/typeorm/entities/SchoolSubject';
import CreateSchoolSubjectService from './CreateSchoolSubjectService';
import ListGradeSchoolSubjectsService from './ListGradeSchoolSubjectsService';
import CreateGradeSchoolSubjectsService from './CreateGradeSchoolSubjectsService';
import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';

@injectable()
class DuplicateGradesSchoolSubjectsService {
  constructor(
    private listGrades: ListGradeService,
    private listSchoolSubjects: ListSchoolSubjectService,
    private listGradeSchoolSubjects: ListGradeSchoolSubjectsService,
    private createGrade: CreateGradeService,
    private createSchoolSubject: CreateSchoolSubjectService,
    private createGradeSchoolSubjects: CreateGradeSchoolSubjectsService,
  ) {}

  private async duplicateGrades(
    grades: Grade[],
    toSchoolYear: SchoolYear,
  ): Promise<Map<string, string>> {
    const result = new Map<string, string>();

    await Promise.all(
      grades.map(grade => {
        return this.createGrade
          .execute({
            description: grade.description,
            after_of: grade.after_of,
            school_year_id: toSchoolYear.id,
          })
          .then(newGrade => {
            result.set(grade.id, newGrade.id);
          });
      }),
    );

    return result;
  }

  private async duplicateSchoolSubjects(
    schoolSubjects: SchoolSubject[],
    toSchoolYear: SchoolYear,
  ): Promise<Map<string, string>> {
    const result = new Map<string, string>();

    await Promise.all(
      schoolSubjects.map(schoolSubject => {
        return this.createSchoolSubject
          .execute({
            description: schoolSubject.description,
            additional_description: schoolSubject.additional_description,
            index: schoolSubject.index,
            is_multidisciplinary: schoolSubject.is_multidisciplinary,
            school_year_id: toSchoolYear.id,
          })
          .then(newSchoolSubject => {
            result.set(schoolSubject.id, newSchoolSubject.id);
          });
      }),
    );

    return result;
  }

  public async execute(
    fromSchoolYear: SchoolYear,
    toSchoolYear: SchoolYear,
  ): Promise<GradeSchoolSubject[]> {
    const previousGrades = await this.listGrades.execute({
      school_year_id: fromSchoolYear.id,
    });
    const previousSchoolSubjects = await this.listSchoolSubjects.execute({
      school_year_id: fromSchoolYear.id,
    });

    const gradesMap = await this.duplicateGrades(previousGrades, toSchoolYear);
    const schoolSubjectsMap = await this.duplicateSchoolSubjects(
      previousSchoolSubjects,
      toSchoolYear,
    );

    const previousGradeSchoolSubjects =
      await this.listGradeSchoolSubjects.execute({
        grade_id: Array.from(gradesMap.keys()),
        school_subject_id: Array.from(schoolSubjectsMap.keys()),
      });

    const createGradeSchoolSubjectsRequests =
      previousGradeSchoolSubjects.reduce<
        Record<string, Array<{ school_subject_id: string; workload: number }>>
      >((acc, gradeSchoolSubject) => {
        const key = gradesMap.get(gradeSchoolSubject.grade_id);
        const schoolSubjectId = schoolSubjectsMap.get(
          gradeSchoolSubject.school_subject_id,
        );

        if (!key) return acc;
        if (!schoolSubjectId) return acc;

        const current = acc[key] || [];
        const newItem = {
          school_subject_id: schoolSubjectId,
          workload: gradeSchoolSubject.workload,
        };

        return { ...acc, [key]: [...current, newItem] };
      }, {});

    const gradeSchoolSubjectsAoA = await Promise.all(
      Object.keys(createGradeSchoolSubjectsRequests).map(gradeId => {
        const schoolSubjects = createGradeSchoolSubjectsRequests[gradeId];

        return this.createGradeSchoolSubjects.execute({
          grade_id: gradeId,
          school_subjects: schoolSubjects,
        });
      }),
    );

    return gradeSchoolSubjectsAoA.reduce(
      (acc, gradeSchoolSubjects) => [...acc, ...gradeSchoolSubjects],
      [],
    );
  }
}

export default DuplicateGradesSchoolSubjectsService;
