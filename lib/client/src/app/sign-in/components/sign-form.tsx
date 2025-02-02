'use client';

import { useActionState, useEffect } from 'react';

import { Button } from 'components/shadcn/button';
import { Input } from 'components/shadcn/input';
import { Label } from 'components/shadcn/label';

import { cn } from 'utils/cnHelper';
import { createUser } from '../actions';
import { Spinner } from 'components/icons/spiner';
import { toast } from 'sonner';

type SignInFormProps = React.HTMLAttributes<HTMLDivElement>;

export function SignInForm({ className, ...props }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(createUser, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error, {
        position: 'top-right',
        // important: true,
        duration: 3000,
        dismissible: true
      });
    }
  }, [state]);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form action={formAction}>
        <div className="grid gap-8">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              CPF
            </Label>
            <Input
              id="username"
              name="username"
              placeholder="12345678909"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={pending}
              defaultValue={state?.values?.username}
            />
            <p aria-live="polite" className="text-sm text-red-700">
              {state?.errors?.username?.[0]}
            </p>
          </div>

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="*****"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={pending}
            />
            <p aria-live="polite" className="text-sm text-red-700">
              {state?.errors?.password?.[0]}
            </p>
          </div>

          <Button className="cursor-pointer" disabled={pending}>
            {pending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Entrar no portal
          </Button>
        </div>
      </form>
    </div>
  );
}
