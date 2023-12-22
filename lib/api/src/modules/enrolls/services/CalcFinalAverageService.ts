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

    let first = schoolReport.first || 0;
    let second = schoolReport.second || 0;
    let third = schoolReport.third || 0;
    let fourth = schoolReport.fourth || 0;
    const first_rec = schoolReport.first_rec || 0;
    const second_rec = schoolReport.second_rec || 0;

    if (!first_recIsNull) {
      if (!fistIsNull && first < 500 && first < first_rec) {
        first = first_rec
      }
      if (!secondIsNull && second < 500 && second < first_rec) {
        second = first_rec
      }
    }

    if (!second_recIsNull) {
      if (!thirdIsNull && third < 500 && third < second_rec) {
        third = second_rec
      }
      if (!fourthIsNull && fourth < 500 && fourth < second_rec) {
        fourth = second_rec
      }
    }

    const firstSemAverage = (first + second) / 2;
    const secondSemAverage = (third + fourth) / 2;

    const finalAverage = (firstSemAverage + secondSemAverage) / 2;
    return Math.round(finalAverage);
  }
}

export default CalcFinalAverageService;
