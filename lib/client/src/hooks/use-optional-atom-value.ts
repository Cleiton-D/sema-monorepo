import { useMemo } from 'react';
import { atom as jotaiAtom, Atom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

export function useOptionalAtomValue<T>(atom?: Atom<T>): T | undefined {
  const optionalAtom = useMemo(
    () =>
      jotaiAtom((get) => {
        if (!atom) return undefined;
        return get(atom);
      }),
    [atom]
  );

  return useAtomValue(optionalAtom);
}
