import { atomFamily, atomWithReset } from 'jotai/utils';
import { atomWithQuery } from 'jotai/query';
import { Session } from 'next-auth';
import deepEqual from 'fast-deep-equal';

import { MultigradeClassroom } from 'models/multigrade-classroom';

import {
  listMultigradeClassrooms,
  multigradesClassroomsKeys
} from 'requests/queries/multigrade-classrooms';

type MultigradeClassroomsAtomParams = {
  multigradeId?: string;
  session: Session | null;
};

export const classroomsAtom = atomWithReset<MultigradeClassroom[]>([]);

export const multigradeClassroomsAtom = atomFamily(
  ({ session, multigradeId }: MultigradeClassroomsAtomParams) => {
    if (!multigradeId) {
      return classroomsAtom;
    }

    const filters = { multigrade_id: multigradeId };

    return atomWithQuery({
      queryKey: multigradesClassroomsKeys.list(JSON.stringify(filters)),
      queryFn: () =>
        listMultigradeClassrooms(session, filters).catch(
          () => [] as MultigradeClassroom[]
        )
    });
  },
  deepEqual
);
