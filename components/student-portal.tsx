'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  BookOpenText,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  attendanceSummary,
  gradeAverage,
  students,
  type Student,
} from '@/lib/student-data';

type Purpose = 'conference' | 'performance' | 'report-card';
type ActivityEntry = { tool: string; studentId?: string; usedAt: string };

const purposeLabels: Record<Purpose, string> = {
  conference: 'Parent conference',
  performance: 'Test-performance concern',
  'report-card': 'Report-card comment',
};

export function StudentPortal() {
  const [studentId, setStudentId] = useState(students[0].id);
  const [briefOpen, setBriefOpen] = useState(false);
  const [purpose, setPurpose] = useState<Purpose>('conference');
  const [approved, setApproved] = useState(false);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const student = students.find((item) => item.id === studentId) ?? students[0];

  useEffect(() => {
    const selectStudent = (event: Event) => {
      const { studentId: selectedId } = (event as CustomEvent<{ studentId: string }>).detail;
      if (students.some((item) => item.id === selectedId)) {
        setStudentId(selectedId);
        setApproved(false);
      }
    };
    const recordToolUse = (event: Event) => {
      const entry = (event as CustomEvent<ActivityEntry>).detail;
      setActivity((current) => [entry, ...current].slice(0, 4));
    };

    window.addEventListener('northstar:select-student', selectStudent);
    window.addEventListener('northstar:tool-used', recordToolUse);
    return () => {
      window.removeEventListener('northstar:select-student', selectStudent);
      window.removeEventListener('northstar:tool-used', recordToolUse);
    };
  }, []);

  useEffect(() => {
    if (!briefOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setBriefOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [briefOpen]);

  const brief = useMemo(() => buildBrief(student, purpose), [student, purpose]);

  function openBrief(nextPurpose: Purpose) {
    setPurpose(nextPurpose);
    setApproved(false);
    setBriefOpen(true);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/80 bg-background/95 px-4 backdrop-blur md:px-7">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <p className="font-heading text-[15px] font-semibold tracking-tight">Northstar SIS</p>
            <p className="text-[11px] text-muted-foreground">Teacher workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button aria-label="Notifications" className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <Bell className="size-4" />
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 text-left shadow-sm">
            <span className="grid size-7 place-items-center rounded-lg bg-accent font-semibold text-accent-foreground">MC</span>
            <span className="hidden sm:block">
              <span className="block text-xs font-semibold">Mrs. Codexa</span>
              <span className="block text-[10px] text-muted-foreground">English teacher</span>
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-64px)] border-r border-border/80 px-3 py-5 md:flex md:flex-col">
          <nav aria-label="Primary navigation" className="space-y-1">
            <NavItem icon={<LayoutDashboard />} label="Overview" />
            <NavItem icon={<UsersRound />} label="My students" active />
            <NavItem icon={<BookOpenText />} label="Classes" />
            <NavItem icon={<FileText />} label="Reports" />
          </nav>
          <div className="mt-auto rounded-2xl border border-primary/15 bg-primary/[0.045] p-3.5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
              <ShieldCheck className="size-4" />Demo environment
            </div>
            <p className="text-[11px] leading-4 text-muted-foreground">All student records are synthetic and created for demonstration.</p>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-6 md:px-7 lg:px-10 lg:py-8">
          <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">My students</p>
              <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Student context</h1>
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Review the records behind every conversation, comment, and support decision.</p>
            </div>

            <div className="relative flex h-10 items-center rounded-xl border border-border bg-card shadow-sm sm:w-80">
              <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
              <select
                aria-label="Select student"
                value={studentId}
                onChange={(event) => { setStudentId(event.target.value); setApproved(false); }}
                className="h-full min-w-0 flex-1 appearance-none bg-transparent px-2 pr-8 text-sm font-medium outline-none"
              >
                {students.map((item) => <option key={item.id} value={item.id}>{item.firstName} {item.lastName} · {item.id}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
            </div>
          </div>

          <StudentHeader student={student} onCreate={() => openBrief('conference')} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
            <RecordTabs student={student} />

            <div className="space-y-4">
              <Card className="rounded-2xl border-primary/15 bg-[#f4faf7] py-0 shadow-none ring-0">
                <CardHeader className="border-b border-[#d9ebe4] py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#176454]"><Sparkles className="size-4" />Agent-ready workspace</div>
                  <CardTitle className="mt-1 text-lg">Build from verified records</CardTitle>
                  <CardDescription>Start a purpose-specific draft. The teacher remains the final reviewer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 py-4">
                  <PromptCard copy="Prepare me for a parent conference" onClick={() => openBrief('conference')} />
                  <PromptCard copy="Explain the recent test performance" onClick={() => openBrief('performance')} />
                  <PromptCard copy="Draft a Term 1 report-card comment" onClick={() => openBrief('report-card')} />
                </CardContent>
              </Card>

              <ActivityCard entries={activity} />

              <Card size="sm" className="rounded-2xl shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm"><ShieldCheck className="size-4 text-primary" />Teacher review required</CardTitle>
                  <CardDescription className="text-xs leading-5">Nothing generated here is automatically sent to a guardian or added to the student record.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </div>

      {briefOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0c2e2b]/25 p-4 backdrop-blur-sm" onMouseDown={() => setBriefOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="brief-title" className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/10" onMouseDown={(event) => event.stopPropagation()}>
            <div className="border-b border-border bg-[#f4faf7] p-5 pr-12">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary"><Sparkles className="size-4" />Evidence brief</div>
              <h2 id="brief-title" className="font-heading text-xl font-semibold">{purposeLabels[purpose]} · {student.firstName} {student.lastName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Drafted from dated Northstar records. Review every statement before use.</p>
            </div>
            <button aria-label="Close evidence brief" onClick={() => setBriefOpen(false)} className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"><X className="size-4" /></button>

          <div className="space-y-5 px-5 pb-2">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(purposeLabels) as Purpose[]).map((item) => (
                <Button key={item} size="sm" variant={purpose === item ? 'default' : 'outline'} onClick={() => { setPurpose(item); setApproved(false); }}>
                  {purposeLabels[item]}
                </Button>
              ))}
            </div>

            <BriefSection title="Verified facts" items={brief.facts} />
            <BriefSection title="Observed pattern" items={brief.patterns} tone="pattern" />
            {brief.draft && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Editable draft</h3>
                <div className="rounded-xl border border-border bg-muted/25 p-4 text-sm leading-6">{brief.draft}</div>
              </section>
            )}
            <BriefSection title="Suggested discussion questions" items={brief.questions} />

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <strong>Review note:</strong> Patterns are not causes. This brief avoids diagnoses, personality labels, and unsupported conclusions.
            </div>
          </div>

          <footer className="mt-5 flex flex-col-reverse items-center justify-between gap-3 border-t border-border bg-muted/50 p-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">{brief.sourceCount} source records referenced</p>
            <Button onClick={() => setApproved(true)} disabled={approved} className="min-w-36">
              {approved ? <><Check />Approved for use</> : <><ClipboardCheck />Approve draft</>}
            </Button>
          </footer>
          </div>
        </div>
      )}
    </main>
  );
}

function StudentHeader({ student, onCreate }: { student: Student; onCreate: () => void }) {
  return (
    <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-[0_10px_35px_-25px_rgba(15,49,58,0.5)] sm:flex-row sm:items-center">
      <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#dcefe8] text-xl font-semibold text-[#0e594b]">{student.initials}</div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight">{student.firstName} {student.lastName}</h2>
          <Badge className="bg-[#e3f3ed] text-[#146452]">Active</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Grade {student.gradeLevel} · {student.className} · Student ID {student.id}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span><strong className="font-medium text-foreground">Guardian:</strong> {student.guardian}</span>
          <span><strong className="font-medium text-foreground">Reporting period:</strong> {student.reportingPeriod}</span>
          <span><strong className="font-medium text-foreground">Last updated:</strong> {student.updatedAt}</span>
        </div>
      </div>
      <Button onClick={onCreate} className="h-10 rounded-xl bg-primary px-4 shadow-sm"><Sparkles />Create evidence brief</Button>
    </div>
  );
}

function RecordTabs({ student }: { student: Student }) {
  const summary = attendanceSummary(student);
  return (
    <Card className="rounded-2xl py-0 shadow-none">
      <Tabs defaultValue="attendance" className="gap-0">
        <div className="overflow-x-auto border-b border-border px-5 pt-4">
          <TabsList variant="line" className="h-10 gap-6">
            <TabsTrigger value="attendance" className="px-0"><CalendarDays />Attendance</TabsTrigger>
            <TabsTrigger value="grades" className="px-0"><BookOpenText />Grades</TabsTrigger>
            <TabsTrigger value="discipline" className="px-0"><ShieldCheck />Disciplinary</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="attendance" className="p-5">
          <div className="mb-5 grid grid-cols-3 gap-3">
            <Metric label="Attendance" value={`${summary.attendanceRate}%`} note={`${summary.recordedDays} recorded days`} />
            <Metric label="Absent" value={String(summary.absent)} note="This term" />
            <Metric label="Late" value={String(summary.late)} note="This term" />
          </div>
          <RecordTable headers={['Date', 'Status', 'Record']} rows={student.attendance.map((record) => [record.date, record.status, record.note])} />
        </TabsContent>

        <TabsContent value="grades" className="p-5">
          <div className="mb-5 grid grid-cols-3 gap-3">
            <Metric label="English average" value={`${gradeAverage(student)}%`} note={`${student.grades.length} graded records`} />
            <Metric label="Latest test" value={student.grades[0] ? `${Math.round(student.grades[0].score / student.grades[0].outOf * 100)}%` : '—'} note={student.grades[0]?.date ?? 'No record'} />
            <Metric label="Missing work" value="0" note="This term" />
          </div>
          <RecordTable headers={['Assessment', 'Type', 'Score']} rows={student.grades.map((record) => [<span key={record.sourceId}><span className="block font-medium">{record.title}</span><span className="block text-xs text-muted-foreground">{record.date}</span></span>, record.category, `${record.score}/${record.outOf}`])} />
        </TabsContent>

        <TabsContent value="discipline" className="p-5">
          {!student.discipline.length ? (
            <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <div><ShieldCheck className="mx-auto mb-3 size-7 text-[#32816e]" /><p className="font-medium">No disciplinary records this term</p><p className="mt-1 text-sm text-muted-foreground">No incidents are recorded for the selected reporting period.</p></div>
            </div>
          ) : (
            <div className="space-y-3">
              {student.discipline.map((record) => (
                <article key={record.sourceId} className="rounded-xl border border-border p-4">
                  <div className="mb-2 flex items-center justify-between gap-3"><Badge variant="outline">{record.category}</Badge><span className="text-xs text-muted-foreground">{record.date}</span></div>
                  <p className="text-sm leading-6">{record.observation}</p>
                  <p className="mt-2 text-xs text-muted-foreground"><strong className="font-medium text-foreground">Documented action:</strong> {record.action}</p>
                </article>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function ActivityCard({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card size="sm" className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm"><Activity className="size-4 text-primary" />WebMCP activity</CardTitle>
        <CardDescription className="text-xs">Six scoped tools are available to the browser agent.</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length ? (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div key={`${entry.usedAt}-${index}`} className="flex items-start gap-2 rounded-lg bg-muted/40 p-2 text-[11px]">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#2f806c]" />
                <span><strong className="font-medium">{entry.tool}</strong>{entry.studentId ? ` · ${entry.studentId}` : ''}<span className="block text-muted-foreground">Read-only access logged</span></span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-[#46a087]" />Ready for an agent request</div>
        )}
      </CardContent>
    </Card>
  );
}

function RecordTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-muted/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{headers.map((header) => <span key={header}>{header}</span>)}</div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-t border-border px-4 py-3 text-sm">{row.map((cell, cellIndex) => <span key={cellIndex} className={cellIndex === 2 ? 'text-muted-foreground' : ''}>{cell}</span>)}</div>
      ))}
    </div>
  );
}

function BriefSection({ title, items, tone = 'fact' }: { title: string; items: string[]; tone?: 'fact' | 'pattern' }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h3>
      <div className={`space-y-2 rounded-xl border p-4 ${tone === 'pattern' ? 'border-[#cfe6df] bg-[#f4faf7]' : 'border-border'}`}>
        {items.map((item) => <p key={item} className="flex gap-2 text-sm leading-5"><Check className="mt-0.5 size-4 shrink-0 text-[#2f806c]" /><span>{item}</span></p>)}
      </div>
    </section>
  );
}

function buildBrief(student: Student, purpose: Purpose) {
  const summary = attendanceSummary(student);
  const average = gradeAverage(student);
  const latest = student.grades[0];
  const tests = student.grades.filter((grade) => grade.category === 'Test');
  const assignments = student.grades.filter((grade) => grade.category === 'Assignment');
  const sourceCount = student.attendance.length + student.grades.length + student.discipline.length;
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

  return { facts, patterns, questions, draft, sourceCount };
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><span className="[&_svg]:size-4">{icon}</span>{label}</button>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-xl border border-border bg-muted/25 p-3"><p className="text-[11px] font-medium text-muted-foreground">{label}</p><p className="mt-1 font-heading text-xl font-semibold tracking-tight">{value}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{note}</p></div>;
}

function PromptCard({ copy, onClick }: { copy: string; onClick: () => void }) {
  return <button onClick={onClick} className="group flex w-full items-center justify-between gap-3 rounded-xl border border-[#d9ebe4] bg-white px-3 py-3 text-left text-xs font-medium transition hover:border-primary/40 hover:shadow-sm"><span>{copy}</span><Sparkles className="size-3.5 shrink-0 text-[#4f8f80] transition group-hover:text-primary" /></button>;
}
