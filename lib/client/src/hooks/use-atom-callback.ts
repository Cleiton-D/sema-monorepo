import { DependencyList, useCallback } from 'react';
import { useAtomCallback as useJotaiAtomCallback } from 'jotai/utils';
import { Getter, Setter } from 'jotai/core/types';

export default function useAtomCallback(
  callback: (get: Getter, set: Setter, arg: any) => any,
  deps: DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useJotaiAtomCallback(useCallback(callback, deps));
}
