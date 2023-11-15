import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SignInForm } from "./components/sign-form";
import { useLoaderData } from "@remix-run/react";
import { Image } from "@/components/ui/image";

export { loader } from './loader'
export { action } from './action'

export default function SignInPage() {
  const {image_url, blurhash} = useLoaderData<{image_url: any, blurhash: any}>()

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="before:content-normal before:absolute before:top-0 before:bottom-0 before:right-0 before:left-0 before:z-10 before:bg-[rgba(0,0,0,0.5)]">
         <Image
          blurDataURL={blurhash}
          className="z-0 w-screen h-screen object-cover fixed top-0 left-0 right-0 bottom-0"
          style={{ filter: "brightness(80%) contrast(120%)" }}
          src={image_url}
          alt="background"
        />
      </div>

      <Card className="z-20 relative max-w-lg">
        <CardHeader className="flex flex-col-reverse justify-between items-center md:flex-row">
          <div className="mr-3 mt-4 md:mt-auto">
          <CardTitle>
            <p className="self-end text-center md:text-left">
            Faça seu login
            </p>
          </CardTitle>
          <CardDescription>
            Digite seu CPF e sua senha nos campos abaixo para acessar o portal
          </CardDescription>
          </div>
          <img
              style={{width: '5rem'}}
              src="./images/logowf.gif"
              alt="logo wf provedor"
            />
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
