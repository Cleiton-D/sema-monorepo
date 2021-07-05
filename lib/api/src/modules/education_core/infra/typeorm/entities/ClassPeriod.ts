import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import SchoolYear from './SchoolYear';

export type ClassPeriodType = 'MORNING' | 'EVENING' | 'NOCTURNAL';

@Entity('class_periods')
class ClassPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['MORNING', 'EVENING', 'NOCTURNAL'] })
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

  @Column()
  school_year_id: string;

  @ManyToOne(() => SchoolYear)
  @JoinColumn({ name: 'school_year_id' })
  school_year: SchoolYear;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ClassPeriod;
