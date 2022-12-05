import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import SchoolSubject from '@modules/education_core/infra/typeorm/entities/SchoolSubject';
import Enroll from './Enroll';

export type SchoolReportStatus =
  | 'ACTIVE'
  | 'CLOSED'
  | 'APPROVED'
  | 'DISAPPROVED'
  | 'RECOVERY'
  | 'EXAM'
  | 'DISAPPROVED_FOR_ABSENCES';

@Entity('school_reports')
class SchoolReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enroll_id: string;

  @ManyToOne(() => Enroll)
  @JoinColumn({ name: 'enroll_id' })
  enroll: Enroll;

  @Column()
  school_subject_id: string;

  @ManyToOne(() => SchoolSubject)
  @JoinColumn({ name: 'school_subject_id' })
  school_subject: SchoolSubject;

  @Column()
  first: number;

  @Column()
  second: number;

  @Column()
  first_rec: number;

  @Column()
  third: number;

  @Column()
  fourth: number;

  @Column()
  second_rec: number;

  @Column()
  exam: number;

  @Column()
  final_average: number;

  @Column()
  annual_average: number;

  @Column({
    type: 'enum',
    enum: [
      'ACTIVE',
      'CLOSED',
      'APPROVED',
      'DISAPPROVED',
      'RECOVERY',
      'EXAM',
      'DISAPPROVED_FOR_ABSENCES',
    ],
  })
  status: SchoolReportStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SchoolReport;
