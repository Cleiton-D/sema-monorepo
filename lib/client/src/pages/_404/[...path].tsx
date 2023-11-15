import { GetServerSidePropsContext } from 'next';

export default function Page404() {
  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: `http://localhost:3000${context.req.url}`,
      permanent: false
    }
  };
}
