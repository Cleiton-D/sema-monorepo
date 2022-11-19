import { MigrationInterface, QueryRunner } from 'typeorm';

type SchoolReport = {
  id: string;
  first?: number;
  second?: number;
  first_rec?: number;
  third?: number;
  fourth?: number;
  second_rec?: number;
  final_average?: number | null;
  annual_average?: number | null;
  exam?: number;
};

type CalcAnnualAveragePayload = {
  first?: number;
  second?: number;
  first_rec?: number;
  third?: number;
  fourth?: number;
  second_rec?: number;
};

type CalcFinalAveragePayload = {
  exam?: number;
  annual_average?: number | null;
};

export default class RecalculateAverages1662230922444
  implements MigrationInterface
{
  private calcAnnualAverage(averages: CalcAnnualAveragePayload) {
    const fistIsNull = averages.first === null;
    const secondIsNull = averages.second === null;
    const thirdIsNull = averages.third === null;
    const fourthIsNull = averages.fourth === null;
    const first_recIsNull = averages.first_rec === null;
    const second_recIsNull = averages.second_rec === null;

    if (
      fistIsNull &&
      secondIsNull &&
      thirdIsNull &&
      fourthIsNull &&
      first_recIsNull &&
      second_recIsNull
    ) {
      return null;
    }

    const first = averages.first || 0;
    const second = averages.second || 0;
    const third = averages.third || 0;
    const fourth = averages.fourth || 0;
    const first_rec = averages.first_rec || 0;
    const second_rec = averages.second_rec || 0;

    let firstSemAverage = (first + second) / 2;
    firstSemAverage =
      firstSemAverage >= first_rec ? firstSemAverage : first_rec;

    let secondSemAverage = (third + fourth) / 2;
    secondSemAverage =
      secondSemAverage >= second_rec ? secondSemAverage : first_rec;

    const finalAverage = (firstSemAverage + secondSemAverage) / 2;
    return Math.round(finalAverage);
  }

  private calcFinalAverage({ exam, annual_average }: CalcFinalAveragePayload) {
    if (annual_average === null) return null;
    if (annual_average === undefined) return null;
    if (!exam) return annual_average;

    const weightAnnualAverage = annual_average * 6;
    const weightExam = exam * 4;
    const sumWeight = weightAnnualAverage + weightExam;

    return Math.round(sumWeight / 10);
  }

  private calcSchoolReport(schoolReport: SchoolReport): SchoolReport {
    const annualAverage = this.calcAnnualAverage({
      first: schoolReport.first,
      second: schoolReport.second,
      first_rec: schoolReport.first_rec,
      third: schoolReport.third,
      fourth: schoolReport.fourth,
      second_rec: schoolReport.second_rec,
    });
    const finalAverage = this.calcFinalAverage({
      exam: schoolReport.exam,
      annual_average: annualAverage,
    });

    return {
      ...schoolReport,
      annual_average: annualAverage,
      final_average: finalAverage,
    };
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schoolReports: SchoolReport[] = await queryRunner.query(
      `SELECT * FROM school_reports`,
    );

    const newAverages = schoolReports.map(this.calcSchoolReport.bind(this));
    const updatePromises = newAverages.map(
      ({ id, final_average, annual_average }) => {
        return queryRunner.query(
          `UPDATE school_reports SET final_average=$1, annual_average=$2 WHERE id = $3`,
          [final_average, annual_average, id],
        );
      },
    );

    await Promise.all(updatePromises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
