import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Status from '@shared/infra/typeorm/enums/Status';

@Entity('school_years')
class SchoolYear {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reference_year: string;

  @Column()
  date_start: Date;

  @Column()
  date_end: Date;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'PENDING'] })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SchoolYear;
