import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import ClassPeriod from '@modules/education_core/infra/typeorm/entities/ClassPeriod';
import SchoolYear from '@modules/education_core/infra/typeorm/entities/SchoolYear';

import School from './School';

@Entity('school_class_periods')
class SchoolClassPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  school_id: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column()
  class_period_id: string;

  @ManyToOne(() => ClassPeriod)
  @JoinColumn({ name: 'class_period_id' })
  class_period: ClassPeriod;

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

export default SchoolClassPeriod;
