import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export type CalendarEventType = 'HOLIDAY' | 'SCHOOL_WEEKEND';
export type CalendarEventCompetence = 'SCHOLL' | 'MUNICIPAL';

@Entity('calendar_events')
class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  school_year_id: string;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ['HOLIDAY', 'SCHOOL_WEEKEND'] })
  type: CalendarEventType;

  @Column({ type: 'enum', enum: ['SCHOLL', 'MUNICIPAL'] })
  competence: CalendarEventCompetence;

  @Column()
  school_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

export default CalendarEvent;
