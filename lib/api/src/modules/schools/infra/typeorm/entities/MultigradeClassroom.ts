import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Multigrade from './Multigrade';
import Classroom from './Classroom';

@Entity('multigrades_classrooms')
class MultigradeClassroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @ManyToOne(() => Multigrade)
  @JoinColumn({ name: 'owner_id' })
  owner: Multigrade;

  @Column()
  classroom_id: string;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classroom;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

export default MultigradeClassroom;
