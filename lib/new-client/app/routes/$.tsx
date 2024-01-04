import { redirectDocument } from "@remix-run/node"
import type {LoaderFunctionArgs} from "@remix-run/node"


export const loader = ({request}:LoaderFunctionArgs) => {
    const url = new URL(request.url)

    
    const host = process.env.LEGACY_URL || url.origin
    const pathname = `/legacy${url.pathname}`
    
    url.href = `${host}${pathname}`
    console.log("caiu aqui", url.toString())

    return redirectDocument(url.toString())
}