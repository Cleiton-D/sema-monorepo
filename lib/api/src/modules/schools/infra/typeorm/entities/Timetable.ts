import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  school_subject_id: string;

  @Column({ type: 'enum' })
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
