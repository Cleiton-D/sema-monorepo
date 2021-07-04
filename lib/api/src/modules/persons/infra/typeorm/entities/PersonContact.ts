import Contact from '@modules/contacts/infra/typeorm/entities/Contact';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Person from './Person';

@Entity('person_contacts')
class PersonContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  person_id: string;

  @ManyToOne(() => Person, person => person.person_contacts)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @Column()
  contact_id: string;

  @ManyToOne(() => Contact, { cascade: ['insert'] })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default PersonContact;
