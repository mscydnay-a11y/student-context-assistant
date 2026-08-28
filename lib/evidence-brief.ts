import { attendanceSummary, gradeAverage, type Student } from '@/lib/student-data';

export type BriefPurpose = 'conference' | 'performance' | 'report-card';

export function buildEvidenceBrief(student: Student, purpose: BriefPurpose) {
  const summary = attendanceSummary(student);
  const average = gradeAverage(student);
  const latest = student.grades[0];
  const tests = student.grades.filter((grade) => grade.category === 'Test');
  const assignments = student.grades.filter((grade) => grade.category === 'Assignment');
  const sourceIds = [
    ...student.attendance.map((record) => record.sourceId),
    ...student.grades.map((record) => record.sourceId),
    ...student.discipline.map((record) => record.sourceId),
  ];
  const facts = [
    `${student.firstName} has a current English average of ${average}% across ${student.grades.length} graded records.`,
    latest ? `The most recent assessment was ${latest.title}: ${latest.score}/${latest.outOf} on ${latest.date} (${latest.sourceId}).` : 'No graded assessment is recorded.',
    `${summary.absent} absence${summary.absent === 1 ? '' : 's'} and ${summary.late} late arrival${summary.late === 1 ? '' : 's'} appear in ${summary.recordedDays} dated attendance records.`,
    `${student.discipline.length} disciplinary record${student.discipline.length === 1 ? '' : 's'} appear${student.discipline.length === 1 ? 's' : ''} this term.`,
  ];
  const patterns = tests.length && assignments.length
    ? [`The recorded test average is ${Math.round(tests.reduce((sum, item) => sum + item.score / item.outOf * 100, 0) / tests.length)}%, compared with ${Math.round(assignments.reduce((sum, item) => sum + item.score / item.outOf * 100, 0) / assignments.length)}% across recorded assignments.`, 'Attendance, grade, and disciplinary records are shown together for context; the records do not establish causation.']
    : ['The available records are not sufficient to compare test and assignment performance.', 'The records do not establish causation.'];
  const questions = purpose === 'report-card'
    ? ['Does this wording reflect what you have directly observed in class?', 'Is there a specific next step you want the student and guardian to act on?']
    : ['What does the student find different about tests compared with assignments?', 'Which support strategy has felt most helpful so far?', 'What next step can school, student, and guardian each agree to?'];
  const draft = purpose === 'report-card'
    ? `${student.firstName} demonstrates stronger performance on completed English assignments than on recent tests. ${student.firstName} contributes developing ideas and would benefit from consistently supporting written responses with specific textual evidence. Continued preparation before assessments and careful review of feedback should support further progress.`
    : purpose === 'performance'
      ? `The available records show a difference between ${student.firstName}’s test and assignment performance. The next conversation should explore assessment preparation and use of textual evidence without assuming a cause.`
      : `Begin with ${student.firstName}’s strengths in completed assignments, review the two recent test records, and invite the student and guardian to help identify a practical next step.`;

  return {
    purpose,
    facts,
    patterns,
    questions,
    draft,
    sourceCount: sourceIds.length,
    sourceIds,
    teacherReviewRequired: true,
  };
}
