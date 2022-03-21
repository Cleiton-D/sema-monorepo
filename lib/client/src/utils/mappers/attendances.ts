import { Attendance } from 'models/Attendance';
import { Enroll } from 'models/Enroll';

type GroupedAttendances = {
  totalAbsences: number;
  totalAttendances: number;
  absencesPercent: number;
  attendances: Attendance[];
  enroll: Enroll;
};

export const groupAttendandesByEnroll = (attendances: Attendance[]) => {
  const result = attendances.reduce<Record<string, GroupedAttendances>>(
    (acc, item) => {
      const currentItem = acc[item.enroll_id] || {};
      const currentAttendances = currentItem.attendances || [];

      let currentTotalAbsences = currentItem.totalAbsences || 0;
      let currentTotalAttendances = currentItem.totalAttendances || 0;

      if (item.attendance) {
        currentTotalAttendances += 1;
      } else {
        currentTotalAbsences += 1;
      }

      const totalClasses = currentTotalAttendances + currentTotalAbsences;
      const absencesPercent = (currentTotalAbsences * 100) / totalClasses;

      const newItem = {
        ...currentItem,
        enroll: item.enroll,
        attendances: [...currentAttendances, item],
        totalAbsences: currentTotalAbsences,
        totalAttendances: currentTotalAttendances,
        absencesPercent
      };

      return { ...acc, [item.enroll_id]: newItem };
    },
    {}
  );

  return Object.values(result);
};
