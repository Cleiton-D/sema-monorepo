import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Contact from '@modules/contacts/infra/typeorm/entities/Contact';
import School from './School';

@Entity('school_contacts')
class SchoolContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  school_id: string;

  @ManyToOne(() => School, school => school.school_contacts)
  @JoinColumn({ name: 'school_id' })
  school: School;

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

export default SchoolContact;
