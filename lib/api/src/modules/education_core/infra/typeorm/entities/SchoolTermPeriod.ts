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

import SchoolYear from './SchoolYear';

@Entity('school_term_periods')
class SchoolTermPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  school_year_id: string;

  @ManyToOne(() => SchoolYear)
  @JoinColumn({ name: 'school_year_id' })
  school_year: SchoolYear;

  @Column({ type: 'enum' })
  school_term: SchoolTerm;

  @Column()
  date_start: Date;

  @Column()
  date_end: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SchoolTermPeriod;
