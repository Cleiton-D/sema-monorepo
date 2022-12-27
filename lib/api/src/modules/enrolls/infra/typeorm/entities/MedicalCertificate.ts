import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('medical_certificates')
class MedicalCertificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enroll_id: string;

  @Column({ type: 'timestamp' })
  date_start: Date;

  @Column({ type: 'timestamp' })
  date_end: Date;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default MedicalCertificate;
