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

import SchoolSubject from './SchoolSubject';
import Grade from './Grade';
import SchoolYear from './SchoolYear';

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

  @Column()
  school_year_id: string;

  @ManyToOne(() => SchoolYear)
  @JoinColumn({ name: 'school_year_id' })
  school_year: SchoolYear;

  @Column()
  workload: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

export default GradeSchoolSubject;
