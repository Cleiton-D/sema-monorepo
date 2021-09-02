import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BranchType } from './Branch';

@Entity('access_levels')
class AccessLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column({ type: 'enum', enum: ['SCHOOL', 'MUNICIPAL_SECRETARY'] })
  only_on: BranchType;

  @Column()
  editable: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default AccessLevel;
