import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Select, { Option } from 'components/Select';

import { ClassPeriod } from 'models/ClassPeriod';

import { useListClassrooms } from 'requests/queries/classrooms';

import {
  orderClassPeriod,
  translateDescription
} from 'utils/mappers/classPeriodMapper';

type ClassroomSelectorProps = {
  exceptId?: string;
  searchParams: Record<string, any>;
  label: string;
  name: string;
};
const ClassroomSelector = ({
  label,
  name,
  searchParams,
  exceptId
}: ClassroomSelectorProps) => {
  const { data: session } = useSession();

  const { data: classrooms, isLoading } = useListClassrooms(
    session,
    searchParams
  );

  const classroomsOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];

    const classroomArray = classrooms?.items || [];
    const filteredClassrooms = classroomArray.filter(
      (classroom) => classroom.id !== exceptId
    );

    const groupedClassrooms = filteredClassrooms.reduce<
      Record<string, { items: Option[]; class_period: ClassPeriod }>
    >((acc, item) => {
      const key = item.class_period_id!;
      const current = acc[key] || {};
      const items = current.items || [];

      const selectItem = {
        label: item.description,
        value: item.id
      };

      const newItem = {
        ...current,
        class_period: item.class_period,
        items: [...items, selectItem]
      };

      return {
        ...acc,
        [key]: newItem
      };
    }, {});

    return Object.values(groupedClassrooms)
      .sort((a, b) => orderClassPeriod(a.class_period, b.class_period))
      .map((item) => ({
        ...item,
        title: translateDescription(item.class_period.description)
      }));
  }, [classrooms, exceptId, isLoading]);

  return <Select label={label} name={name} options={classroomsOptions} />;
};

export default ClassroomSelector;
