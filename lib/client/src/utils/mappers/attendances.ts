import { Attendance, MinifiedAttendance } from 'models/Attendance';
import { Enroll } from 'models/Enroll';
import { EnrollClassroom } from 'models/EnrollClassroom';

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

type AttendancesWithEnroll = {
  enroll: Enroll;
  enroll_classroom: EnrollClassroom;
  attendances: MinifiedAttendance[];
};

export const getEnrollsWithAttendances = (
  enrollClassrooms?: EnrollClassroom[],
  attendances?: MinifiedAttendance[]
) => {
  if (!enrollClassrooms) return [];
  if (!attendances) return [];

  const groupedEnrollsClassrooms = enrollClassrooms.reduce<
    Record<string, EnrollClassroom>
  >((acc, enrollClassroom) => {
    return { ...acc, [enrollClassroom.id]: enrollClassroom };
  }, {});

  const groupedAttedances = attendances.reduce<
    Record<string, AttendancesWithEnroll>
  >((acc, attendance) => {
    const current = acc[attendance.enroll_id] || {};
    const currentAttendances = current.attendances || [];

    const enrollClassroom =
      groupedEnrollsClassrooms[attendance.enroll_classroom_id];

    return {
      ...acc,
      [attendance.enroll_id]: {
        ...current,
        enroll: enrollClassroom.enroll,
        enroll_classroom: enrollClassroom,
        attendances: [...currentAttendances, attendance]
      }
    };
  }, {});

  return enrollClassrooms.map((enrollClassroom) => {
    const item = groupedAttedances[enrollClassroom.enroll_id];
    if (!item) {
      return {
        enroll: enrollClassroom.enroll,
        enroll_classroom: enrollClassroom,
        attendances: {}
      };
    }

    const { attendances = [], enroll, enroll_classroom } = item;

    const enrollAttendances = attendances.reduce<Record<string, boolean>>(
      (acc, attendance) => {
        return { ...acc, [attendance.class_id]: attendance.attendance };
      },
      {}
    );

    return {
      enroll,
      enroll_classroom,
      attendances: enrollAttendances || {}
    };
  });
};
