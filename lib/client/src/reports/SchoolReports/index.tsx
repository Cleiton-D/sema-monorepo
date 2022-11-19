import { useEffect } from 'react';
import Head from 'next/head';

import SchoolReportItem, { CompleteEnroll } from './SchoolReportItem';

export type SchoolReportsReportProps = {
  enrolls: CompleteEnroll[];
};
const SchoolReportsReport = ({ enrolls }: SchoolReportsReportProps) => {
  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 100);
  }, []);

  return (
    <>
      <Head>
        <title>Boletim</title>
      </Head>
      {enrolls.map((item) => (
        <SchoolReportItem key={item.enrollClassroom.id} completeEnroll={item} />
      ))}
    </>
  );
};

export default SchoolReportsReport;
