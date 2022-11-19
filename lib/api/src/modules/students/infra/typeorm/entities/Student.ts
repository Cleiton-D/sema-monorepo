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

import { Gender } from '@shared/infra/typeorm/enums/Gender';

import StudentContact from './StudentContact';

@Entity('students')
class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mother_name: string;

  @Column()
  dad_name: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: Gender;

  @Column()
  address_id: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column()
  birth_date: Date;

  @Column()
  cpf: string;

  @Column()
  rg: string;

  @Column()
  nis: string;

  @Column()
  birth_certificate: string;

  @Column()
  breed: string;

  @Column()
  naturalness: string;

  @Column()
  naturalness_uf: string;

  @Column()
  identity_document: string;

  @Column()
  unique_code: string;

  @Column()
  nationality: string;

  @OneToMany(() => StudentContact, studentContact => studentContact.student, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinTable()
  @Exclude()
  student_contacts: StudentContact[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'contacts' })
  getContacts(): Contact[] {
    if (!this.student_contacts) return [];

    return this.student_contacts.map(
      student_contact => student_contact.contact,
    );
  }
}

export default Student;
