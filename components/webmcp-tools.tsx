'use client';

import { useEffect } from 'react';

import {
  attendanceSummary,
  getStudent,
  gradeAverage,
  students,
  type Student,
} from '@/lib/student-data';

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: Record<string, unknown>) => unknown | Promise<unknown>;
};

type ModelContext = {
  registerTool: (tool: ToolDefinition, options?: { signal?: AbortSignal }) => Promise<void>;
};

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
}

const studentIdSchema = {
  type: 'object',
  properties: {
    student_id: {
      type: 'string',
      description: 'The exact Northstar student ID, for example NS-1048.',
    },
  },
  required: ['student_id'],
  additionalProperties: false,
};

function publicProfile(student: Student) {
  return {
    studentId: student.id,
    name: `${student.firstName} ${student.lastName}`,
    gradeLevel: student.gradeLevel,
    className: student.className,
    guardian: student.guardian,
    reportingPeriod: student.reportingPeriod,
    lastUpdated: student.updatedAt,
  };
}

function notifyToolUse(tool: string, studentId?: string) {
  window.dispatchEvent(
    new CustomEvent('northstar:tool-used', {
      detail: { tool, studentId, usedAt: new Date().toISOString() },
    }),
  );
}

function requireStudent(studentId: unknown) {
  if (typeof studentId !== 'string') throw new Error('student_id must be a string.');
  const student = getStudent(studentId);
  if (!student) throw new Error(`No student is available with ID ${studentId}.`);
  return student;
}

export function WebMcpTools() {
  useEffect(() => {
    const modelContext = document.modelContext;
    if (!modelContext) return;

    const controller = new AbortController();

    const tools: ToolDefinition[] = [
      {
        name: 'search_students',
        description:
          'Search Mrs. Codexa’s authorized English 10B student roster by name or student ID. Returns basic student identity only.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'A full or partial student name or ID.' },
          },
          required: ['query'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: ({ query }) => {
          const normalized = String(query ?? '').trim().toLowerCase();
          const matches = students
            .filter((student) =>
              `${student.firstName} ${student.lastName} ${student.id}`.toLowerCase().includes(normalized),
            )
            .map(publicProfile);
          notifyToolUse('search_students');
          return { matches, count: matches.length, syntheticData: true };
        },
      },
      {
        name: 'get_student_profile',
        description:
          'Get the authorized school profile for one student on Mrs. Codexa’s English 10B roster. All records are synthetic demo data.',
        inputSchema: studentIdSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: ({ student_id }) => {
          const student = requireStudent(student_id);
          notifyToolUse('get_student_profile', student.id);
          return { profile: publicProfile(student), syntheticData: true };
        },
      },
      {
        name: 'get_attendance_records',
        description:
          'Get dated attendance records and a calculated attendance summary for one authorized student.',
        inputSchema: studentIdSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: ({ student_id }) => {
          const student = requireStudent(student_id);
          notifyToolUse('get_attendance_records', student.id);
          return {
            student: publicProfile(student),
            summary: attendanceSummary(student),
            records: student.attendance,
            syntheticData: true,
          };
        },
      },
      {
        name: 'get_grade_records',
        description:
          'Get Mrs. Codexa’s dated English assessment and assignment records for one authorized student, including teacher notes and source IDs.',
        inputSchema: studentIdSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: ({ student_id }) => {
          const student = requireStudent(student_id);
          notifyToolUse('get_grade_records', student.id);
          return {
            student: publicProfile(student),
            calculatedAverage: gradeAverage(student),
            records: student.grades,
            syntheticData: true,
          };
        },
      },
      {
        name: 'get_disciplinary_records',
        description:
          'Get dated, factual disciplinary observations and documented actions for one authorized student. Do not infer personality, diagnosis, or intent.',
        inputSchema: studentIdSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: ({ student_id }) => {
          const student = requireStudent(student_id);
          notifyToolUse('get_disciplinary_records', student.id);
          return {
            student: publicProfile(student),
            records: student.discipline,
            recordCount: student.discipline.length,
            syntheticData: true,
          };
        },
      },
      {
        name: 'open_student_record',
        description:
          'Open an authorized student’s record in the visible Northstar SIS interface for Mrs. Codexa to review.',
        inputSchema: studentIdSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: ({ student_id }) => {
          const student = requireStudent(student_id);
          window.dispatchEvent(
            new CustomEvent('northstar:select-student', { detail: { studentId: student.id } }),
          );
          notifyToolUse('open_student_record', student.id);
          return { opened: publicProfile(student), teacherReviewRequired: true };
        },
      },
    ];

    Promise.all(
      tools.map((tool) => modelContext.registerTool(tool, { signal: controller.signal })),
    ).catch((error) => {
      console.warn('Northstar WebMCP tools could not be registered.', error);
    });

    return () => controller.abort();
  }, []);

  return null;
}
