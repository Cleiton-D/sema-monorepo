import { MigrationInterface, QueryRunner } from 'typeorm';

type Multidisciplinary = {
  multidisciplinary_id: string;
  employee_id: string;
  classroom_id: string;
};

export default class RemoveMultidisciplinaryDuplicates1657068927408
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const multidisciplinaries: Multidisciplinary[] = await queryRunner.query(`
      SELECT ct.id as multidisciplinary_id,
             ct.classroom_id,
             ct.employee_id
        FROM classroom_teacher_school_subjects ct
       WHERE ct.school_subject_id IS NULL
         AND ct.deleted_at IS NULL
    `);

    if (!multidisciplinaries?.length) return;

    const hashTable: Record<string, Multidisciplinary> = {};
    const duplicates: string[] = [];

    multidisciplinaries.forEach(item => {
      const key = `${item.employee_id}-${item.classroom_id}`;

      if (hashTable[key]) {
        duplicates.push(item.multidisciplinary_id);
      } else {
        hashTable[key] = item;
      }
    });

    const deleteDuplicates = duplicates.map(item => {
      return queryRunner.query(
        `
        UPDATE classroom_teacher_school_subjects SET deleted_at = NOW()
         WHERE id = $1
      `,
        [item],
      );
    });

    await Promise.all(deleteDuplicates);

    const filteredItems = Object.values(hashTable);

    const updatedItems = filteredItems.map(({ multidisciplinary_id }) => {
      return queryRunner.query(
        `
        UPDATE classroom_teacher_school_subjects
           SET is_multidisciplinary = true,
               updated_at = NOW()
         WHERE id = $1
      `,
        [multidisciplinary_id],
      );
    });

    await Promise.all(updatedItems);
  }

  public async down(): Promise<void> {
    console.log('revert unavailable');
  }
}
