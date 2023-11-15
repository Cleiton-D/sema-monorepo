import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const validator = withZod(
  z.object({
    username: z.string().min(1, { message: "Campo obrigatório" }),
    password: z.string().min(1, { message: "Campo obrigatório" }),
  })
);
