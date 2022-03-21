import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Address from '@modules/address/infra/typeorm/entities/Address';
import Contact from '@modules/contacts/infra/typeorm/entities/Contact';
import Branch from '@modules/authorization/infra/typeorm/entities/Branch';
import Enroll from '@modules/enrolls/infra/typeorm/entities/Enroll';

import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import SchoolContact from './SchoolContact';

@Entity('schools')
class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  inep_code: string;

  @Column()
  address_id: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(() => SchoolContact, schoolContact => schoolContact.school, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinTable()
  @Exclude()
  school_contacts: SchoolContact[];

  @Column()
  branch_id: string;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column()
  director_id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'director_id' })
  director: Employee;

  @Column()
  vice_director_id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'vice_director_id' })
  vice_director: Employee;

  @Column()
  creation_decree: string;

  @Column()
  recognition_opinion: string;

  @Column()
  authorization_ordinance: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'contacts' })
  getContacts(): Contact[] {
    return this.school_contacts?.map(
      school_contacts => school_contacts.contact,
    );
  }

  @OneToMany(() => Enroll, enroll => enroll.school)
  @JoinTable()
  @Exclude()
  enrolls: Enroll[];

  enroll_count: number;
}

export default School;
