import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import NominalRelation, {
  NominalRelationReportProps
} from 'reports/NominalRelation';

import { showClassroom } from 'requests/queries/classrooms';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

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

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { classroom_id } = context.query;

    const classroom = await showClassroom(
      {
        id: classroom_id as string
      },
      context.req.session
    );

    const enrollClassrooms = await listEnrollClassrooms(
      {
        classroom_id: classroom_id as string
      },
      context.req.session
    );

    return {
      props: {
        classroom,
        enrollClassrooms
      }
    };
  }
);
