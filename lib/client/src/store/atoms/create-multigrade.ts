import { atomFamily, atomWithReset } from 'jotai/utils';
import { atomWithQuery } from 'jotai/query';
import deepEqual from 'fast-deep-equal';

import { MultigradeClassroom } from 'models/multigrade-classroom';

import {
  listMultigradeClassrooms,
  multigradesClassroomsKeys
} from 'requests/queries/multigrade-classrooms';

type MultigradeClassroomsAtomParams = {
  multigradeId?: string;
};

export const classroomsAtom = atomWithReset<MultigradeClassroom[]>([]);
