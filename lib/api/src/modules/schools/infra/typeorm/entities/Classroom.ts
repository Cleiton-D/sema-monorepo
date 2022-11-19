import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Grade from '@modules/education_core/infra/typeorm/entities/Grade';
import SchoolYear from '@modules/education_core/infra/typeorm/entities/SchoolYear';
import EnrollClassroom from '@modules/enrolls/infra/typeorm/entities/EnrollClassroom';
import ClassPeriod from '@modules/education_core/infra/typeorm/entities/ClassPeriod';

import School from './School';

@Entity('classrooms')
class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  class_period_id: string;

  @ManyToOne(() => ClassPeriod)
  @JoinColumn({ name: 'class_period_id' })
  class_period: ClassPeriod;

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

  @Column()
  school_year_id: string;

  @ManyToOne(() => SchoolYear)
  @JoinColumn({ name: 'school_year_id' })
  school_year: SchoolYear;

  @Column()
  capacity: number;

  @OneToMany(
    () => EnrollClassroom,
    enrollClassroom => enrollClassroom.classroom,
  )
  @JoinTable()
  enroll_classrooms: EnrollClassroom[];

  @Column()
  is_multigrade: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  enroll_count?: number;
}

export default Classroom;
