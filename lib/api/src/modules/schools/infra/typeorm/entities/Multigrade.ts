import { Entity, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Classroom from './Classroom';
import MultigradeClassroom from './MultigradeClassroom';

@Entity('classrooms')
class Multigrade extends Classroom {
  @OneToMany(
    () => MultigradeClassroom,
    multigradeClassroom => multigradeClassroom.owner,
  )
  @Exclude()
  multigrade_classrooms: MultigradeClassroom[];

  @Expose({ name: 'classrooms' })
  getClassrooms(): Classroom[] {
    if (!this.multigrade_classrooms) return [];

    return this.multigrade_classrooms.map(
      multigrade_classroom => multigrade_classroom.classroom,
    );
  }
}

export default Multigrade;
