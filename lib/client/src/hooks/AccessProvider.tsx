import {
  createContext,
  useMemo,
  useContext,
  useCallback,
  forwardRef
} from 'react';

import Loading from 'templates/Loading';
import NoAccessTemplate from 'templates/NoAccess';

import { useAccessModules } from 'requests/queries/session';

import { SessionAccess } from 'models/Session';

import { validateHasAccess, WithAccessOptions } from 'utils/validateHasAccess';

type AccessContextData = {
  modules: SessionAccess[];
  enableAccess: (options: WithAccessOptions) => boolean;
};

const AccessContext = createContext({} as AccessContextData);

type AccessProviderProps = {
  access: WithAccessOptions;
  children: React.ReactNode;
};
const AccessProvider = ({ children, access }: AccessProviderProps) => {
  const { data: modules = [], isLoading } = useAccessModules();

  const hasAccess = useMemo(() => {
    return validateHasAccess(modules, access);
  }, [modules, access]);

  const enableAccess = useCallback(
    (options: WithAccessOptions) => {
      return validateHasAccess(modules, options);
    },
    [modules]
  );

  return (
    <AccessContext.Provider value={{ modules, enableAccess }}>
      {isLoading ? (
        <Loading />
      ) : (
        <>{hasAccess ? children : <NoAccessTemplate />}</>
      )}
    </AccessContext.Provider>
  );
};

function useAccess() {
  return useContext(AccessContext);
}

type WithAccessProps<T> = React.PropsWithRef<T> & Partial<WithAccessOptions>;

type WithAccessComponentType<T> = ((
  props: WithAccessProps<T>,
  ref: unknown
) => JSX.Element | null) & {
  displayName: string;
};

function withAccessComponent<P>(
  Component: React.ComponentType<P> | React.ForwardRefExoticComponent<P>
) {
  const PrivateComponent: WithAccessComponentType<P> = (
    { module, rule, ...props },
    ref
  ) => {
    const { enableAccess } = useAccess();

    const hasAccess = useMemo(() => {
      if (!module) return true;

      return enableAccess({ module, rule });
    }, [enableAccess, module, rule]);

    return hasAccess ? (
      <Component {...(props as unknown as P)} ref={ref} />
    ) : null;
  };

  PrivateComponent.displayName = `withPermissions(${
    Component.displayName || Component.name
  })`;

  return forwardRef(PrivateComponent) as React.ForwardRefExoticComponent<
    WithAccessProps<P>
  >;
}

export { AccessProvider, useAccess, withAccessComponent };
