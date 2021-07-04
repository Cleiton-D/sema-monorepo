import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import AccessModule from './AccessModule';

@Entity('app_modules')
class AppModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AccessModule, accessModule => accessModule.app_module)
  @JoinTable()
  access_modules: AccessModule[];
}

export default AppModule;
