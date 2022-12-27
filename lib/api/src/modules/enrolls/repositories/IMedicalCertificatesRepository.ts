import CreateMedicalCertificateDTO from '../dtos/CreateMedicalCertificateDTO';
import MedicalCertificate from '../infra/typeorm/entities/MedicalCertificate';

export default interface IMedicalCertificatesRepository {
  create: (data: CreateMedicalCertificateDTO) => Promise<MedicalCertificate>;
}
