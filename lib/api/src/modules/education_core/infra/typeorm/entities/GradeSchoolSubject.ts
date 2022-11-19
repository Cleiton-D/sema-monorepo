import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { VirtualColumn } from '@shared/decorators/virtualColumn';
import SchoolSubject from './SchoolSubject';
import Grade from './Grade';

@Entity('grade_school_subjects')
class GradeSchoolSubject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  school_subject_id: string;

  @ManyToOne(() => SchoolSubject)
  @JoinColumn({ name: 'school_subject_id' })
  school_subject: SchoolSubject;

  @Column()
  grade_id: string;

  @ManyToOne(() => Grade)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @Exclude()
  @Column()
  workload: number;

  @Exclude()
  @VirtualColumn()
  calculated_workload: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Expose({ name: 'workload' })
  getWorkload(): number {
    return this.calculated_workload || this.workload;
  }
}

export default GradeSchoolSubject;
