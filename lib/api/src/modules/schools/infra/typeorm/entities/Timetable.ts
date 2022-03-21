import SchoolSubject from '@modules/education_core/infra/typeorm/entities/SchoolSubject';
import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Classroom from './Classroom';

export type DayOfWeek =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

@Entity('timetables')
class Timetable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  classroom_id: string;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classroom;

  @Column()
  school_subject_id: string;

  @ManyToOne(() => SchoolSubject)
  @JoinColumn({ name: 'school_subject_id' })
  school_subject: SchoolSubject;

  @Column()
  employee_id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    type: 'enum',
    enum: [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ],
  })
  day_of_week: DayOfWeek;

  @Column({ type: 'time' })
  time_start: string;

  @Column({ type: 'time' })
  time_end: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Timetable;
