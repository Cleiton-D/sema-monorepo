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
import PersonContact from './PersonContact';
import PersonDocument from './PersonDocument';

export type Gender = 'male' | 'female';

@Entity('persons')
class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mother_name: string;

  @Column()
  dad_name?: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: Gender;

  @Column()
  address_id: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(() => PersonDocument, personDocument => personDocument.person, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  documents: PersonDocument[];

  @OneToMany(() => PersonContact, personContact => personContact.person, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinTable()
  @Exclude()
  person_contacts: PersonContact[];

  @Column('timestamp')
  birth_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'contacts' })
  getContacts(): Contact[] {
    return this.person_contacts.map(person_contact => person_contact.contact);
  }
}

export default Person;
