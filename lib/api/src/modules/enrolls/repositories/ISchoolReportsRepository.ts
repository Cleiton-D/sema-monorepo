import CreateSchoolReportDTO from '../dtos/CreateSchoolReportDTO';
import FindSchoolReportDTO from '../dtos/FindSchoolReportDTO';
import SchoolReport from '../infra/typeorm/entities/SchoolReport';

export default interface ISchoolReportsRepository {
  findAll: (filters: FindSchoolReportDTO) => Promise<SchoolReport[]>;
  updateMany: (schoolReports: SchoolReport[]) => Promise<SchoolReport[]>;
  createMany: (data: CreateSchoolReportDTO[]) => Promise<SchoolReport[]>;
}
