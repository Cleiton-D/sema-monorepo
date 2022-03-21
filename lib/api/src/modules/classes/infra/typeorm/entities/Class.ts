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

import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import SchoolSubject from '@modules/education_core/infra/typeorm/entities/SchoolSubject';
import Classroom from '@modules/schools/infra/typeorm/entities/Classroom';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Class;
