import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import AccessLevel from './AccessLevel';
import AppModule from './AppModule';

@Entity('access_modules')
class AccessModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  access_level_id: string;

  @ManyToOne(() => AccessLevel)
  @JoinColumn({ name: 'access_level_id' })
  access_level: AccessLevel;

  @Column()
  app_module_id: string;

  @ManyToOne(() => AppModule)
  @JoinColumn({ name: 'app_module_id' })
  app_module: AppModule;

  @Column()
  read: boolean;

  @Column()
  write: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default AccessModule;
