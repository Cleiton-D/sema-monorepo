import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import NominalRelation, {
  NominalRelationReportProps
} from 'reports/NominalRelation';

import { showClassroom } from 'requests/queries/classrooms';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';

import protectedRoutes from 'utils/protected-routes';

export default function SchoolReports(props: NominalRelationReportProps) {
  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 100);
  }, []);

  return (
    <>
      <Head>
        <title>Relação Nominal {props.classroom.description}</title>
      </Head>

      <NominalRelation {...props} />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { classroom_id } = context.query;

  const session = await protectedRoutes(context);
  if (!session) return;

  const classroom = await showClassroom(session, {
    id: classroom_id as string
  });

  const enrollClassrooms = await listEnrollClassrooms(session, {
    classroom_id: classroom_id as string
  });

  return {
    props: {
      session,
      classroom,
      enrollClassrooms
    }
  };
}
