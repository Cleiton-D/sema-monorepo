import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ClassPeriodType = 'MORNING' | 'EVENING' | 'NOCTURNAL';

@Entity('class_periods')
class ClassPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum' })
  description: ClassPeriodType;

  @Column({ type: 'time' })
  time_start: string;

  @Column({ type: 'time' })
  time_end: string;

  @Column({ type: 'time' })
  class_time: string;

  @Column({ type: 'time' })
  break_time: string;

  @Column({ type: 'time' })
  break_time_start: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ClassPeriod;
