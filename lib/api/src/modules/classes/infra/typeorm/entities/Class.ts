import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  class_date: Date;

  @Column({ type: 'time' })
  time_start: string;

  @Column({ type: 'time' })
  time_end: string;

  @Column({ type: 'enum', enum: ['PROGRESS', 'DONE'] })
  status: ClassStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Class;
