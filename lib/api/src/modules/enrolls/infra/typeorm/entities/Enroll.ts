import {
  Column,
  CreateDateColumn,
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
import School from '@modules/schools/infra/typeorm/entities/School';
import Person from '@modules/persons/infra/typeorm/entities/Person';

import Classroom from '@modules/schools/infra/typeorm/entities/Classroom';
import { Exclude, Expose } from 'class-transformer';
import EnrollClassroom from './EnrollClassroom';

export type EnrollStatus = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED';

@Entity('enrolls')
class Enroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum' })
  status: EnrollStatus;

  @Column()
  person_id: string;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person: Person;

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

  @Exclude()
  @OneToMany(() => EnrollClassroom, enrollClassroom => enrollClassroom.enroll, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinTable()
  enroll_classrooms: EnrollClassroom[];

  @Column()
  school_year_id: string;

  @ManyToOne(() => SchoolYear)
  @JoinColumn({ name: 'school_year_id' })
  school_year: SchoolYear;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'current_classroom' })
  getCurrentClassroom(): Classroom | undefined {
    if (this.enroll_classrooms.length <= 0) return undefined;

    const activeEnrollClassroom = this.enroll_classrooms.find(
      ({ status }) => status === 'ACTIVE',
    );

    return activeEnrollClassroom ? activeEnrollClassroom.classroom : undefined;
  }
}

export default Enroll;
