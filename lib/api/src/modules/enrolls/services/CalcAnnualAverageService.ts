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
}

export default CalcAnnualAverageService;
