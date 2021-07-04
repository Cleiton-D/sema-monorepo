import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import AccessLevel from '@modules/authorization/infra/typeorm/entities/AccessLevel';
import Branch from '@modules/authorization/infra/typeorm/entities/Branch';

import User from './User';

@Entity('user_profiles')
class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  branch_id: string;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column()
  access_level_id: string;

  @ManyToOne(() => AccessLevel)
  @JoinColumn({ name: 'access_level_id' })
  access_level: AccessLevel;

  @Column()
  default_profile: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UserProfile;
