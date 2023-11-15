import { type LoaderFunctionArgs } from "@remix-run/node";
import { authLoader } from "~/utils/auth-middleware.server";

export async function loader({ request }: LoaderFunctionArgs) {
    await authLoader(request)
    
    const {image_url, blurhash} = await fetch(`${process.env.SERVER_API_URL}/admin/background/current`).then(response => response.json())
    return {image_url, blurhash}
}