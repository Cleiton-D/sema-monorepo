import { useMemo, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { atom, PrimitiveAtom, Provider as JotaiProvider } from 'jotai';
import { RESET } from 'jotai/utils';
import Cookies from 'js-cookie';

import { parseCookies, setCookies } from 'utils/parseCookies';
import useAtomCallback from './use-atom-callback';

type StoredAtom = {
  base: PrimitiveAtom<any>;
  derived: PrimitiveAtom<any>;
};

type StoredAtomsType = Record<string, StoredAtom>;

const APP_KEY = 'SEMA-state';
const atoms: StoredAtomsType = {};

function setStoreAtom<T>(key: string, value: T) {
  const stored = Cookies.get(APP_KEY);
  const existentAtoms = stored ? JSON.parse(stored) : {};
  const newAtoms = { ...existentAtoms, [key]: value };

  Cookies.set(APP_KEY, JSON.stringify(newAtoms));
}

function getStoredAtom<T = unknown>(key: string): T | undefined {
  const stored = Cookies.get(APP_KEY);
  const existentAtoms = stored ? JSON.parse(stored) : {};
  return existentAtoms[key];
}

export function getStoredInitalState(context: GetServerSidePropsContext) {
  const cookies = parseCookies(context);
  const stored = cookies[APP_KEY];

  return stored ? JSON.parse(stored) : {};
}

export function storeServerAtom<T>(
  context: GetServerSidePropsContext,
  key: string,
  value: T
) {
  const stored = getStoredInitalState(context);
  const newAtoms = { ...stored, [key]: value };

  setCookies(context, APP_KEY, JSON.stringify(newAtoms));
  return newAtoms;
}

export function atomWithCookie<T>(key: string, initialValue: T) {
  const getInitialValue = () => {
    const value = getStoredAtom<T>(key);
    return value || initialValue;
  };

  const baseAtom = atom<T>(getInitialValue());
  const derivedAtom = atom<T, unknown>(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue = (() => {
        if (update === RESET) return initialValue;
        if (typeof update === 'function') return update(get(baseAtom));
        return update;
      })();

      set(baseAtom, nextValue);
      setStoreAtom(key, nextValue);
    }
  );

  atoms[key] = {
    base: baseAtom,
    derived: derivedAtom
  };

  return derivedAtom;
}

type AtomProviderProps = {
  children: React.ReactNode;
  initialState?: Record<string, any>;
};

type JotaiInitialValues = Iterable<readonly [PrimitiveAtom<any>, unknown]>;

export const AtomProvider = ({
  children,
  initialState = {}
}: AtomProviderProps) => {
  const values = useMemo(
    () =>
      Object.entries(initialState).reduce<JotaiInitialValues>(
        (acc, [key, value]) => {
          const atom = atoms[key];
          if (!atom) return acc;

          const { base } = atom;
          return [...acc, [base, value]];
        },
        []
      ),
    [initialState]
  );

  return <JotaiProvider initialValues={values}>{children}</JotaiProvider>;
};

export const AtomHydrator = ({
  children,
  initialState = {}
}: AtomProviderProps) => {
  const updateAtom = useAtomCallback(
    async (_, set, item: [PrimitiveAtom<any>, unknown]) => {
      const [atom, value] = item;
      set(atom, value);
    },
    []
  );

  useEffect(() => {
    Object.entries(initialState).forEach(([key, value]) => {
      const atom = atoms[key];
      if (!atom) return;

      const { derived } = atom;
      updateAtom([derived, value]);
    });
  }, [initialState, updateAtom]);

  return <>{children}</>;
};
