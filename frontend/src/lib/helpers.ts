export function calculateSkillMatch(studentSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 0;
  const matched = requiredSkills.filter(s =>
    studentSkills.some(ss => ss.toLowerCase() === s.toLowerCase())
  );
  return Math.round((matched.length / requiredSkills.length) * 100);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatSalary(min?: number, max?: number): string {
  if (min == null || max == null) return 'Unpaid';
  return `$${min} – $${max}`;
}
