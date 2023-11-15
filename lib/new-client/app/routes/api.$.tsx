import {json, type LoaderFunctionArgs} from "@remix-run/node"


export const loader = async ({request}:LoaderFunctionArgs) => {
    const url = new URL(request.url)

    const host = process.env.LEGACY_URL_INTERNAL
    const pathname = `/legacy${url.pathname}`

    url.href = `${host}${pathname}`

    const response = await fetch(url.toString(), {
        body: request.body,
        headers: request.headers,
        method: request.method,
        signal: request.signal,
        credentials: request.credentials,
    })

    const result = await response.json()

    return json(result, {headers: { "Access-Control-Allow-Origin": "*",}})
}