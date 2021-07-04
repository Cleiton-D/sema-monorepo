import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Enroll from '@modules/enrolls/infra/typeorm/entities/Enroll';
import Class from './Class';

@Entity('attendances')
class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enroll_id: string;

  @ManyToOne(() => Enroll)
  @JoinColumn({ name: 'enroll_id' })
  enroll: Enroll;

  @Column()
  class_id: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column()
  attendance: boolean;

  @Column()
  justified: boolean;

  @Column()
  justification_description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Attendance;
