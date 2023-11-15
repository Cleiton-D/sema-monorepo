import { useEffect } from "react";
import { useActionData, useNavigation } from "@remix-run/react";
import { toast } from "sonner";

import { ValidatedForm } from "remix-validated-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ValidatedInput, ValidatedInputError, ValidatedInputWrapper } from "@/components/ui/validated-input";

import { cn } from "@/lib/utils";
import { Spinner } from "@/icons/spiner";

import { validator } from "../validator/login-form";

import type { ActionData } from "../action";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: SignInFormProps) {
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();
  
  const isLoading = navigation.state === 'submitting' || navigation.state === 'loading'

  useEffect(() => {
    if (actionData?.error) {
        toast.error(actionData.error, { position: 'top-right', important: true, duration: 3000 })
    }
  }, [actionData])

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <ValidatedForm validator={validator} method="post">
        <div className="grid gap-8">
          <ValidatedInputWrapper>
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <ValidatedInput
              id="username"
              name="username"
              placeholder="name@example.com"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
            />
            <ValidatedInputError name="username" />
          </ValidatedInputWrapper>
          <ValidatedInputWrapper>
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <ValidatedInput
              id="password"
              name="password"
              placeholder="*****"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
            />
             <ValidatedInputError name="password" />
          </ValidatedInputWrapper>
          <Button disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Entrar no portal
          </Button>
        </div>
      </ValidatedForm>
    </div>
  );
}
