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

export default class FixAverages1666652858601 implements MigrationInterface {
  private getBimonthlyAverage(schoolReport: SchoolReport) {
    const fistIsNull = schoolReport.first === null;
    const secondIsNull = schoolReport.second === null;
    const thirdIsNull = schoolReport.third === null;
    const fourthIsNull = schoolReport.fourth === null;
    const first_recIsNull = schoolReport.first_rec === null;
    const second_recIsNull = schoolReport.second_rec === null;

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

    const first = schoolReport.first || 0;
    const second = schoolReport.second || 0;
    const third = schoolReport.third || 0;
    const fourth = schoolReport.fourth || 0;
    const first_rec = schoolReport.first_rec || 0;
    const second_rec = schoolReport.second_rec || 0;

    let firstSemAverage = (first + second) / 2;
    firstSemAverage =
      firstSemAverage >= first_rec ? firstSemAverage : first_rec;

    let secondSemAverage = (third + fourth) / 2;
    secondSemAverage =
      secondSemAverage >= second_rec ? secondSemAverage : second_rec;

    const finalAverage = (firstSemAverage + secondSemAverage) / 2;
    return Math.round(finalAverage);
  }

  private calcFinalAverage(schoolReport: SchoolReport): number | null {
    const bimonthlyAverage = this.getBimonthlyAverage(schoolReport);
    if (bimonthlyAverage === null) return null;
    if (bimonthlyAverage === undefined) return null;
    if (!schoolReport.exam) return bimonthlyAverage;

    const weightAnnualAverage = bimonthlyAverage * 6;
    const weightExam = schoolReport.exam * 4;
    const sumWeight = weightAnnualAverage + weightExam;

    return Math.round(sumWeight / 10);
  }

  private calcAnnualAverage(schoolReport: SchoolReport): number | null {
    const fistIsNull = schoolReport.first === null;
    const secondIsNull = schoolReport.second === null;
    const thirdIsNull = schoolReport.third === null;
    const fourthIsNull = schoolReport.fourth === null;
    const first_recIsNull = schoolReport.first_rec === null;
    const second_recIsNull = schoolReport.second_rec === null;

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

    const first = schoolReport.first || 0;
    const second = schoolReport.second || 0;
    const third = schoolReport.third || 0;
    const fourth = schoolReport.fourth || 0;
    const first_rec = schoolReport.first_rec || 0;
    const second_rec = schoolReport.second_rec || 0;

    let lengthFirst = 0;
    if (fistIsNull && secondIsNull && !first_recIsNull) {
      lengthFirst = 2;
    } else {
      if (!fistIsNull) lengthFirst += 1;
      if (!secondIsNull) lengthFirst += 1;
    }

    let firstSemAverage = (first + second) / lengthFirst;
    firstSemAverage =
      firstSemAverage >= first_rec ? firstSemAverage : first_rec;
    firstSemAverage *= lengthFirst;

    let lengthSecond = 0;
    if (thirdIsNull && fourthIsNull && !second_recIsNull) {
      lengthSecond = 2;
    } else {
      if (!thirdIsNull) lengthSecond += 1;
      if (!fourthIsNull) lengthSecond += 1;
    }

    let secondSemAverage = (third + fourth) / lengthSecond;
    secondSemAverage =
      secondSemAverage >= second_rec ? secondSemAverage : first_rec;
    secondSemAverage *= lengthSecond;

    const totalReports = lengthFirst + lengthSecond;
    const finalAverage = (firstSemAverage + secondSemAverage) / totalReports;
    return Math.round(finalAverage);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schoolReports: SchoolReport[] = await queryRunner.query(
      `SELECT * FROM school_reports`,
    );

    if (!schoolReports?.length) return;

    const updatePromises = schoolReports.map(schoolReport => {
      const newAnnualAverage = this.calcAnnualAverage(schoolReport);
      const newFinalAverage = this.calcFinalAverage(schoolReport);

      return queryRunner.query(
        `UPDATE school_reports SET annual_average=$1, final_average=$2 WHERE id = $3`,
        [newAnnualAverage, newFinalAverage, schoolReport.id],
      );
    });

    await Promise.all(updatePromises);
  }

  public async down(): Promise<void> {
    console.log('rollback is not possible');
  }
}
