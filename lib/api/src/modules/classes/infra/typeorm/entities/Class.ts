import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';
import { VirtualColumn } from '@shared/decorators/virtualColumn';

import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import SchoolSubject from '@modules/education_core/infra/typeorm/entities/SchoolSubject';
import Classroom from '@modules/schools/infra/typeorm/entities/Classroom';

import Multiclass from './Multiclass';
import Attendance from './Attendance';

export type ClassStatus = 'PROGRESS' | 'DONE';

@Entity('classes')
class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  school_subject_id: string;

  @ManyToOne(() => SchoolSubject)
  @JoinColumn({ name: 'school_subject_id' })
  school_subject: SchoolSubject;

  @Column()
  classroom_id: string;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classroom;

  @Column()
  taught_content: string;

  @Column()
  period: string;

  @Column()
  date_start: Date;

  @Column()
  date_end: Date;

  @Column()
  class_date: Date;

  @Column({ type: 'enum', enum: ['PROGRESS', 'DONE'] })
  status: ClassStatus;

  @Column({ type: 'enum', enum: ['FIRST', 'SECOND', 'THIRD', 'FOURTH'] })
  school_term: SchoolTerm;

  @OneToMany(() => Attendance, attendance => attendance.class, {
    cascade: ['soft-remove'],
  })
  attendances: Attendance[];

  @OneToMany(() => Multiclass, multiclass => multiclass.class, {
    cascade: ['insert', 'soft-remove'],
  })
  multiclasses: Multiclass[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @VirtualColumn()
  edit_available: boolean;
  // @Expose({ name: 'edit_available' })
  // getEditAvailable(): Promise<boolean> {
  //   return new Promise((resolve) => resolve(true))
  //   // return isBefore(new Date(), addDays(this.created_at, 10));
  // }
}

export default Class;
