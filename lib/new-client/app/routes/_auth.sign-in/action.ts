import { json, type ActionFunction } from "@remix-run/node";
import { validationError } from "remix-validated-form";

import { createUserSession, login } from "~/utils/session.server";
import { validator } from "./validator/login-form";

const badRequest = (data: any) =>
    json(data, { status: 400 }
);

export interface ActionData {
    error?: string
}

export const action: ActionFunction = async ({request}) => {
    const data = await validator.validate(await request.formData())
    if (data.error) return validationError(data.error);

    const { username, password } = data.data;
    const loginData = await login({ username, password })
    if (!loginData.token) {
        return badRequest({
            error: 'Usuario ou senha invalidos'
        })
    }

    return createUserSession(request, loginData.token)
}