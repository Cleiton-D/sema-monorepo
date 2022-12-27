import { injectable } from 'tsyringe';

import SchoolReport from '../infra/typeorm/entities/SchoolReport';

@injectable()
class CalcFinalAverageService {
  public execute(schoolReport: SchoolReport): number | null {
    const bimonthlyAverage = this.getBimonthlyAverage(schoolReport);
    if (bimonthlyAverage === null) return null;
    if (bimonthlyAverage === undefined) return null;
    if (!schoolReport.exam) return bimonthlyAverage;

    const weightAnnualAverage = bimonthlyAverage * 6;
    const weightExam = schoolReport.exam * 4;
    const sumWeight = weightAnnualAverage + weightExam;

    return Math.round(sumWeight / 10);
  }

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
}

export default CalcFinalAverageService;
