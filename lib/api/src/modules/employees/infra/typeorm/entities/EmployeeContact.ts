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
import Employee from './Employee';

@Entity('employee_contacts')
class EmployeeContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @ManyToOne(() => Employee, employee => employee.employee_contacts)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

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

export default EmployeeContact;
