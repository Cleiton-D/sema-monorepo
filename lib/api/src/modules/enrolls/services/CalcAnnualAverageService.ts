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

    console.log("first", first, typeof first)
    console.log("second", second, typeof second)
    console.log("third", third, typeof third)
    console.log("fourth", fourth, typeof fourth)

    console.log("first_rec", first_rec, typeof first_rec)
    console.log("second_rec", second_rec, typeof second_rec)

    let lengthFirst = 0;
    if (fistIsNull && secondIsNull && !first_recIsNull) {
      lengthFirst = 2;
    } else {
      if (!fistIsNull) lengthFirst += 1;
      if (!secondIsNull) lengthFirst += 1;
    }

    console.log("length first", lengthFirst, typeof lengthFirst)

    if (!first_recIsNull) {
      if (fistIsNull || (first < 600 && first < first_rec)) {
        first = first_rec
      }
      if (secondIsNull || (second < 600 && second < first_rec)) {
        second = first_rec
      }
    }

    console.log("first after", first, typeof first)
    console.log("second after", second, typeof second)

    if (!second_recIsNull) {
      if (thirdIsNull || (third < 600 && third < second_rec)) {
        third = second_rec
      }
      if (fourthIsNull || (fourth < 600 && fourth < second_rec)) {
        fourth = second_rec
      }
    }

    console.log("third after", third, typeof third)
    console.log("fourth after", fourth, typeof fourth)

    const firstSemSum = (first + second);

    console.log("first sem sum", firstSemSum, typeof firstSemSum)

    let lengthSecond = 0;
    if (thirdIsNull && fourthIsNull && !second_recIsNull) {
      lengthSecond = 2;
    } else {
      if (!thirdIsNull) lengthSecond += 1;
      if (!fourthIsNull) lengthSecond += 1;
    }

    console.log("length second", lengthSecond, typeof lengthSecond)

    const secondSemSum = (third + fourth);

    console.log("second sem sum", secondSemSum, typeof secondSemSum)

    const totalReports = lengthFirst + lengthSecond;

    console.log("total reports", totalReports, typeof totalReports)

    const annualAverage = (firstSemSum + secondSemSum) / totalReports;

    console.log("anual average", annualAverage, typeof annualAverage)
    return Math.round(annualAverage);
  }
}

export default CalcAnnualAverageService;
