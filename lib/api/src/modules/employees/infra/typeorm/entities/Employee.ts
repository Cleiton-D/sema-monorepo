import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import Address from '@modules/address/infra/typeorm/entities/Address';
import Contact from '@modules/contacts/infra/typeorm/entities/Contact';

import { Gender } from '@shared/infra/typeorm/enums/Gender';

import EmployeeContact from './EmployeeContact';

@Entity('employees')
class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mother_name?: string;

  @Column()
  dad_name?: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: Gender;

  @Column()
  address_id: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column('timestamp')
  birth_date: Date;

  @OneToMany(
    () => EmployeeContact,
    employeeContact => employeeContact.employee,
    {
      eager: true,
      cascade: ['insert'],
    },
  )
  @JoinTable()
  @Exclude()
  employee_contacts: EmployeeContact[];

  @Column()
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  cpf: string;

  @Column()
  rg: string;

  @Column()
  pis_pasep: string;

  @Column()
  education_level: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Expose({ name: 'contacts' })
  getContacts(): Contact[] {
    return this.employee_contacts.map(
      employee_contact => employee_contact.contact,
    );
  }
}

export default Employee;
