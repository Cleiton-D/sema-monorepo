import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Classroom from '@modules/schools/infra/typeorm/entities/Classroom';
import Enroll from './Enroll';

@Entity('enroll_classrooms')
class EnrollClassroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column()
  classroom_id: string;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classroom;

  @Column()
  enroll_id: string;

  @ManyToOne(() => Enroll)
  @JoinColumn({ name: 'enroll_id' })
  enroll: Enroll;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default EnrollClassroom;
