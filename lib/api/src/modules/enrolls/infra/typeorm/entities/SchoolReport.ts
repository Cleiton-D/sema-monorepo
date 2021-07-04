import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import SchoolSubject from '@modules/education_core/infra/typeorm/entities/SchoolSubject';
import Enroll from './Enroll';

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
  average: number;

  @Column({ type: 'enum' })
  school_term: SchoolTerm;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SchoolReport;
