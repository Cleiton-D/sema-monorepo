export default function Page404() {
  if (window) {
    const url = new URL(window.location.href);
    const newpathname = url.pathname.replace('/legacy', '');
    url.pathname = newpathname;

    window.location.href = url.toString();
  }

  return null;
}
