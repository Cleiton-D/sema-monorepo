import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type BranchType = 'SCHOOL' | 'MUNICIPAL_SECRETARY';

@Entity('branchs')
class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ['SCHOOL', 'MUNICIPAL_SECRETARY'] })
  type: BranchType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Branch;
