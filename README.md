# Student Context Assistant

Student Context Assistant is a WebMCP-enabled demonstration SIS for K–12 teachers. It helps an authorized teacher gather attendance, English grades, and disciplinary records into a purpose-specific evidence brief while keeping every conclusion subject to teacher review.

The MVP uses entirely synthetic data. Mrs. Codexa can switch between students in her English 10B roster, inspect dated source records, prepare a parent-conference brief, review a test-performance concern, or draft a report-card comment. Nothing is automatically sent to a guardian or written back to a student record.

## WebMCP tools

The site registers six browser tools through `document.modelContext`: `search_students`, `get_student_profile`, `get_attendance_records`, `get_grade_records`, `get_disciplinary_records`, and `open_student_record`. The first five return scoped, read-only records. The final tool changes the visible student record so the teacher can review it directly. Invocations appear in the on-screen WebMCP activity panel.

## Run locally

The ChatGPT Sites project requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server in ChatGPT’s in-app browser or a WebMCP-enabled Chrome build. Create a production build with `npm run build`.

## Privacy and safety

All names, IDs, guardians, grades, attendance events, and disciplinary records are fictional. Tool descriptions instruct agents to avoid diagnoses, personality labels, causal claims, and unsupported conclusions. Evidence briefs distinguish verified facts from observed patterns and require affirmative teacher approval.

## License

MIT
