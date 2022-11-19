import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Grade from '@modules/education_core/infra/typeorm/entities/Grade';
import SchoolYear from '@modules/education_core/infra/typeorm/entities/SchoolYear';
import School from '@modules/schools/infra/typeorm/entities/School';
import Classroom from '@modules/schools/infra/typeorm/entities/Classroom';
import Student from '@modules/students/infra/typeorm/entities/Student';

import ClassPeriod from '@modules/education_core/infra/typeorm/entities/ClassPeriod';
import EnrollClassroom from './EnrollClassroom';

export type EnrollStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'TRANSFERRED'
  | 'QUITTER'
  | 'DECEASED'
  | 'APPROVED'
  | 'DISAPPROVED';

export type EnrollOrigin = 'NEW' | 'REPEATING';
@Entity('enrolls')
class Enroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'TRANSFERRED'] })
  status: EnrollStatus;

  @Column()
  student_id: string;

  @ManyToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  school_id: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column()
  grade_id: string;

  @ManyToOne(() => Grade)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @Exclude()
  @OneToMany(() => EnrollClassroom, enrollClassroom => enrollClassroom.enroll, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinTable()
  enroll_classrooms: EnrollClassroom[];

  @Column()
  school_year_id: string;

  @ManyToOne(() => SchoolYear)
  @JoinColumn({ name: 'school_year_id' })
  school_year: SchoolYear;

  @Column({ type: 'enum', enum: ['NEW', 'REPEATING'] })
  origin: EnrollOrigin;

  @Column()
  class_period_id: string;

  @ManyToOne(() => ClassPeriod)
  @JoinColumn({ name: 'class_period_id' })
  class_period: ClassPeriod;

  @Column({ default: 'now()' })
  enroll_date: Date;

  @Column()
  transfer_date?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'current_classroom' })
  getCurrentClassroom(): Classroom | undefined {
    if (!this.enroll_classrooms) return undefined;
    if (this.enroll_classrooms.length <= 0) return undefined;

    const activeEnrollClassroom = this.enroll_classrooms.find(
      ({ status }) => status === 'ACTIVE',
    );

    return activeEnrollClassroom ? activeEnrollClassroom.classroom : undefined;
  }
}

export default Enroll;
