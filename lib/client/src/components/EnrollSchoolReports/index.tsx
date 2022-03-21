import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { Enroll } from 'models/Enroll';

import { useListSchoolReports } from 'requests/queries/school-reports';
import { SchoolReport } from 'models/SchoolReport';
import { SchoolTerm } from 'models/SchoolTerm';
import {
  orderSchoolTerm,
  shortTranslateSchoolTerm
} from 'utils/mappers/schoolTermPeriodMapper';
import SchoolReportsBySchoolSubjects from 'components/SchoolReportsBySchoolSubjects';
import Tab from 'components/Tab';

type EnrollSchoolReportsProps = {
  enroll: Enroll;
};
const EnrollSchoolReports = ({
  enroll
}: EnrollSchoolReportsProps): JSX.Element => {
  const { data: session } = useSession();
  const { data: schoolReports } = useListSchoolReports(session, {
    enroll_id: enroll.id
  });

  const tabItems = useMemo(() => {
    if (!schoolReports) return [];

    const groupedSchoolReports = schoolReports.reduce<
      Record<SchoolTerm, SchoolReport[]>
    >(
      (acc, item) => {
        const current = acc[item.school_term] || [];
        return { ...acc, [item.school_term]: [...current, item] };
      },
      {
        FIRST: [],
        SECOND: [],
        THIRD: [],
        FOURTH: [],
        'FIRST-REC': [],
        'SECOND-REC': [],
        EXAM: []
      }
    );

    const sortedItems = Object.entries(groupedSchoolReports).sort(
      ([a], [b]) => {
        return orderSchoolTerm(a as SchoolTerm, b as SchoolTerm);
      }
    );

    return sortedItems.map(([key, value]) => {
      return {
        title: shortTranslateSchoolTerm(key as SchoolTerm),
        element: (
          <SchoolReportsBySchoolSubjects key={key} schoolReports={value} />
        )
      };
    });
  }, [schoolReports]);

  return <Tab items={tabItems} />;
};

export default EnrollSchoolReports;
