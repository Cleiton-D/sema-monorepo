import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import School from '@modules/schools/infra/typeorm/entities/School';
import Student from './Student';

export type StudentSchoolStatus = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED';

@Entity('student_schools')
class StudentSchool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  student_id: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  school_id: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'TRANSFERRED'] })
  status: StudentSchoolStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default StudentSchool;
