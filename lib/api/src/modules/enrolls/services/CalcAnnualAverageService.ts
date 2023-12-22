import { injectable } from 'tsyringe';

import SchoolReport from '../infra/typeorm/entities/SchoolReport';

@injectable()
class CalcAnnualAverageService {
  public execute(schoolReport: SchoolReport): number | null {
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

    let lengthFirst = 0;
    if (fistIsNull && secondIsNull && !first_recIsNull) {
      lengthFirst = 2;
    } else {
      if (!fistIsNull) lengthFirst += 1;
      if (!secondIsNull) lengthFirst += 1;
    }

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


    let firstSemAverage = (first + second) / lengthFirst;
    firstSemAverage *= lengthFirst;

    let lengthSecond = 0;
    if (thirdIsNull && fourthIsNull && !second_recIsNull) {
      lengthSecond = 2;
    } else {
      if (!thirdIsNull) lengthSecond += 1;
      if (!fourthIsNull) lengthSecond += 1;
    }

    let secondSemAverage = (third + fourth) / lengthSecond;
    secondSemAverage *= lengthSecond;

    const totalReports = lengthFirst + lengthSecond;
    const annualAverage = (firstSemAverage + secondSemAverage) / totalReports;
    return Math.round(annualAverage);
  }
}

export default CalcAnnualAverageService;
