import {
  createContext,
  useMemo,
  useContext,
  useCallback,
  forwardRef
} from 'react';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import Loading from 'templates/Loading';
import NoAccessTemplate from 'templates/NoAccess';

import { AccessModule } from 'models/AccessModule';

import {
  acessModulesKeys,
  listAccessModules,
  useListAccessModules
} from 'requests/queries/access-modules';

import { validateHasAccess, WithAccessOptions } from 'utils/validateHasAccess';

type AccessContextData = {
  modules: AccessModule[];
  enableAccess: (options: WithAccessOptions) => boolean;
};

const AccessContext = createContext({} as AccessContextData);

type AccessProviderProps = {
  access: WithAccessOptions;
  children: React.ReactNode;
};
const AccessProvider = ({ children, access }: AccessProviderProps) => {
  const { data: session } = useSession();

  const { data: accessModules = [], isLoading } = useListAccessModules(
    session,
    {
      access_level_id: session?.accessLevel?.id
    },
    { refetchInterval: false, enabled: !!session?.accessLevel?.id }
  );

  const modules = useMemo(() => {
    if (!session?.accessLevel?.id) return [];

    return accessModules;
  }, [session, accessModules]);

  const hasAccess = useMemo(() => {
    return validateHasAccess(session, modules, access);
  }, [session, modules, access]);

  const enableAccess = useCallback(
    (options: WithAccessOptions) => {
      return validateHasAccess(session, modules, options);
    },
    [modules, session]
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

const withAccess = async (
  context: GetServerSidePropsContext,
  session: Session | null,
  options: WithAccessOptions
) => {
  const filters = {
    access_level_id: session?.accessLevel?.id
  };
  const modules = await listAccessModules(session, filters);

  if (!validateHasAccess(session, modules || [], options)) {
    context.res.writeHead(302, {
      Location: `/`
    });
    context.res.end();
  }

  return {
    modules,
    queryKey: acessModulesKeys.list(
      JSON.stringify({ ...filters, token: session?.jwt })
    )
  };
};

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

export { AccessProvider, useAccess, withAccess, withAccessComponent };
