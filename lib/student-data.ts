export type AttendanceRecord = {
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  note: string;
  sourceId: string;
};

export type GradeRecord = {
  date: string;
  title: string;
  category: 'Test' | 'Assignment' | 'Participation';
  score: number;
  outOf: number;
  note: string;
  sourceId: string;
};

export type DisciplineRecord = {
  date: string;
  category: string;
  observation: string;
  action: string;
  sourceId: string;
};

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  gradeLevel: number;
  className: string;
  guardian: string;
  reportingPeriod: string;
  updatedAt: string;
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  discipline: DisciplineRecord[];
};

export const students: Student[] = [
  {
    id: 'NS-1048',
    firstName: 'Maya',
    lastName: 'Rolle',
    initials: 'MR',
    gradeLevel: 10,
    className: 'English 10B',
    guardian: 'Andrea Rolle',
    reportingPeriod: 'Term 1',
    updatedAt: 'Aug 27, 2026',
    attendance: [
      { date: 'Aug 27, 2026', status: 'Present', note: 'On time', sourceId: 'ATT-1048-0827' },
      { date: 'Aug 26, 2026', status: 'Present', note: 'On time', sourceId: 'ATT-1048-0826' },
      { date: 'Aug 25, 2026', status: 'Absent', note: 'Guardian notified; unexcused', sourceId: 'ATT-1048-0825' },
      { date: 'Aug 24, 2026', status: 'Late', note: 'Arrived 8 minutes late', sourceId: 'ATT-1048-0824' },
      { date: 'Aug 21, 2026', status: 'Present', note: 'On time', sourceId: 'ATT-1048-0821' },
      { date: 'Aug 20, 2026', status: 'Absent', note: 'Medical note received', sourceId: 'ATT-1048-0820' },
    ],
    grades: [
      { date: 'Aug 27, 2026', title: 'Narrative Writing Test', category: 'Test', score: 58, outOf: 100, note: 'Strong opening; evidence was not developed across body paragraphs.', sourceId: 'GRD-1048-0827' },
      { date: 'Aug 18, 2026', title: 'Reading Comprehension Test', category: 'Test', score: 62, outOf: 100, note: 'Literal questions were accurate; inference responses needed textual support.', sourceId: 'GRD-1048-0818' },
      { date: 'Aug 13, 2026', title: 'Character Analysis', category: 'Assignment', score: 78, outOf: 100, note: 'Clear ideas with two relevant quotations.', sourceId: 'GRD-1048-0813' },
      { date: 'Aug 7, 2026', title: 'Vocabulary in Context', category: 'Assignment', score: 84, outOf: 100, note: 'Completed on time.', sourceId: 'GRD-1048-0807' },
    ],
    discipline: [
      { date: 'Aug 19, 2026', category: 'Classroom readiness', observation: 'Arrived without the assigned novel and borrowed a classroom copy.', action: 'Reminder issued; guardian contact not required.', sourceId: 'DSC-1048-0819' },
    ],
  },
  {
    id: 'NS-1052',
    firstName: 'Dario',
    lastName: 'Johnson',
    initials: 'DJ',
    gradeLevel: 10,
    className: 'English 10B',
    guardian: 'Keisha Johnson',
    reportingPeriod: 'Term 1',
    updatedAt: 'Aug 27, 2026',
    attendance: [
      { date: 'Aug 27, 2026', status: 'Present', note: 'On time', sourceId: 'ATT-1052-0827' },
      { date: 'Aug 26, 2026', status: 'Present', note: 'On time', sourceId: 'ATT-1052-0826' },
      { date: 'Aug 25, 2026', status: 'Present', note: 'On time', sourceId: 'ATT-1052-0825' },
    ],
    grades: [
      { date: 'Aug 27, 2026', title: 'Narrative Writing Test', category: 'Test', score: 76, outOf: 100, note: 'Well organized; edit sentence boundaries.', sourceId: 'GRD-1052-0827' },
      { date: 'Aug 18, 2026', title: 'Reading Comprehension Test', category: 'Test', score: 81, outOf: 100, note: 'Used relevant evidence in extended responses.', sourceId: 'GRD-1052-0818' },
      { date: 'Aug 13, 2026', title: 'Character Analysis', category: 'Assignment', score: 88, outOf: 100, note: 'Thoughtful analysis and accurate quotations.', sourceId: 'GRD-1052-0813' },
    ],
    discipline: [],
  },
  {
    id: 'NS-1061',
    firstName: 'Leah',
    lastName: 'Smith',
    initials: 'LS',
    gradeLevel: 10,
    className: 'English 10B',
    guardian: 'Marcus Smith',
    reportingPeriod: 'Term 1',
    updatedAt: 'Aug 26, 2026',
    attendance: [
      { date: 'Aug 26, 2026', status: 'Present', note: 'On time', sourceId: 'ATT-1061-0826' },
      { date: 'Aug 25, 2026', status: 'Late', note: 'Arrived 5 minutes late', sourceId: 'ATT-1061-0825' },
      { date: 'Aug 24, 2026', status: 'Present', note: 'On time', sourceId: 'ATT-1061-0824' },
    ],
    grades: [
      { date: 'Aug 27, 2026', title: 'Narrative Writing Test', category: 'Test', score: 91, outOf: 100, note: 'Compelling voice and careful structure.', sourceId: 'GRD-1061-0827' },
      { date: 'Aug 18, 2026', title: 'Reading Comprehension Test', category: 'Test', score: 87, outOf: 100, note: 'Strong inference and evidence selection.', sourceId: 'GRD-1061-0818' },
      { date: 'Aug 13, 2026', title: 'Character Analysis', category: 'Assignment', score: 90, outOf: 100, note: 'Insightful and well supported.', sourceId: 'GRD-1061-0813' },
    ],
    discipline: [],
  },
];

export function getStudent(studentId: string) {
  return students.find((student) => student.id === studentId);
}

export function attendanceSummary(student: Student) {
  const total = student.attendance.length;
  const present = student.attendance.filter((record) => record.status === 'Present').length;
  const absent = student.attendance.filter((record) => record.status === 'Absent').length;
  const late = student.attendance.filter((record) => record.status === 'Late').length;

  return {
    recordedDays: total,
    present,
    absent,
    late,
    attendanceRate: total ? Math.round(((present + late) / total) * 100) : 0,
  };
}

export function gradeAverage(student: Student) {
  if (!student.grades.length) return 0;
  const percentages = student.grades.map((grade) => (grade.score / grade.outOf) * 100);
  return Math.round(percentages.reduce((total, score) => total + score, 0) / percentages.length);
}
