import { isServer } from "utils/isServer";

export default function Page404() {
  if (!isServer) {
    const url = new URL(window.location.href);
    // const newpathname = url.pathname.replace('/legacy', '');
    // url.pathname = newpathname;

    window.location.href = url.toString();
  }

  return null;
}
