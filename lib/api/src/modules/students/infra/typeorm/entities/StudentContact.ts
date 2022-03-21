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
import Student from './Student';

@Entity('student_contacts')
class StudentContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  student_id: string;

  @ManyToOne(() => Student, student => student.student_contacts)
  @JoinColumn({ name: 'student_id' })
  student: Student;

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

export default StudentContact;
