import { GetServerSidePropsContext } from 'next';

export default function Page404() {
  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log("caiu aqui", context)

  return {
    redirect: {
      destination: `${process.env.REMIX_APP_URL}${context.req.url}`,
      permanent: false
    }
  };
}
