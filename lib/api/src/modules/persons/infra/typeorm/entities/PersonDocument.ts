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

export type DocumentType = 'RG' | 'CPF' | 'CNH' | 'PIS-PASEP';

@Entity('person_documents')
class PersonDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  person_id: string;

  @ManyToOne(() => Person, person => person.documents)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @Column()
  document_number: string;

  @Column({ type: 'enum', enum: ['RG', 'CPF', 'CNH', 'PIS-PASEP'] })
  document_type: DocumentType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default PersonDocument;
